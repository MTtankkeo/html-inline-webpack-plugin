import { Compilation, Compiler, sources } from "webpack";
import { parse } from "node-html-parser";
import { format } from "prettier"
import path from "path";
import fs from "fs";
import { AssetInjector, ScriptAssetInjector, StyleAssetInjector } from "../modules/asset_injector";
import { FavIconInjector, HeadInjector } from "../modules/head_injector";
import { ScriptAssetInjectorWithBlob, StyleAssetInjectorWithBlob } from "../modules/asset_injector_with_blob";
import { HTMLInlineWebpackPluginScriptLoading } from "../types";

/** Signature for the interface that defines option values of [HTMLInlineWebpackPlugin]. */
export interface HTMLInlineWebpackPluginOptions {
    /** The path of the HTML document to finally insert an assets. */
    template: string;
    /** The path of the HTML document that is outputed finally. */
    filename: string;
    /** The path of the favicon.ico file about the HTML document. */
    favIcon?: string;
    /** Whether the assets will ultimately be injected into the given HTML document template. */
    inject?: boolean;
    /**
     * Whether it loads and operates asynchronously in the same way as the existing method,
     * but handles loading data as a blob to avoid re-requesting resources from the server.
     */
    injectAsBlob: boolean;
    /**
     * Whether to reduce the number of resource requests to the server by injecting
     * asset content all at once into the document template instead of using
     * the traditional asynchronous request method.
     * 
     * By default, it is set to `true`, but in development mode, it is exceptionally defined as `false`.
     * 
     * ```html
     * <!-- is false. -->
     * <script src="main.js"></script>
     * 
     * <!-- is true. -->
     * <script>console.log("Hello, World!");</script>
     * ```
     */
    inline?: boolean;
    pretty?: boolean;
    processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
    scriptLoading?: HTMLInlineWebpackPluginScriptLoading;
}

/** This webpack plugin package is bundling related HTML files by injecting inline tags. */
export class HTMLInlineWebpackPlugin {
    private assetInjectors = new Map<string, AssetInjector<any>>();
    private headInjectors: HeadInjector[] = [];

    constructor(public options: HTMLInlineWebpackPluginOptions) {
        // TODO: ...
    }

    applyContext(options: Required<HTMLInlineWebpackPluginOptions>) {
        /** Whether asset resource should be inserted in blob form. */
        const isInjectAsBlob = options.injectAsBlob;

        this.assetInjectors.set(".js", isInjectAsBlob
            ? new ScriptAssetInjectorWithBlob({scriptLoading: options.scriptLoading})
            : new ScriptAssetInjector({inline: options.inline, scriptLoading: options.scriptLoading})
        );

        this.assetInjectors.set(".css", isInjectAsBlob
            ? new StyleAssetInjectorWithBlob()
            : new StyleAssetInjector({inline: options.inline})
        );

        if (options.favIcon != null) {
            this.headInjectors.push(new FavIconInjector(options.favIcon));
        }
    }

    apply(compiler: Compiler) {
        const mode = compiler.options.mode;
        const template = this.options?.template ?? "./src/index.html"; // input or entry
        const filename = this.options?.filename ?? "index.html";       // output or exit
        const favIcon = this.options?.favIcon ?? "";
        const inject = this.options?.inject ?? true;
        const injectAsBlob = this.options?.injectAsBlob ?? false;
        const inline = this.options?.inline ?? mode == "production"; // by web-dev-server
        const pretty = this.options?.pretty ?? false;
        const processStage = this.options.processStage ?? "OPTIMIZE_INLINE";
        const scriptLoading = this.options.scriptLoading ?? "DEFER";

        this.applyContext({
            template: template,
            filename: filename,
            favIcon: favIcon,
            inject: inject,
            injectAsBlob: injectAsBlob,
            inline: inline,
            pretty: pretty,
            processStage: processStage,
            scriptLoading: scriptLoading
        });

        if (inject && path.extname(template) != ".html") {
            throw new Error("A given path of [template] is not an HTML document file format.");
        }

        // See Also, this processed after all compiled resource files have been bundled.
        compiler.hooks.compilation.tap("HTMLInlineWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: "HTMLInlineWebpackPlugin",
                stage: processStage == "OPTIMIZE_INLINE"
                    ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                    : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (_, callback) => {
                fs.readFile(path.resolve(template), "utf-8", async (err, data) => {
                    if (err) {
                        throw new Error(`Exception while reading the file of a given HTML template path: ${err.message}`);
                    }

                    if (inject) {
                        const injected = this.inject(compilation, data as string);
                        const formated = pretty ? await format(injected, {parser: "html"}) : injected;

                        this.output(compilation, filename, formated);
                    }

                    callback();
                });
            });
        });
    }

    /** Inserts the content of assets as inline into a given HTML document in head or body. */
    inject(compilation: Compilation, docText: string): string {
        const document = parse(docText);
        const documentHead = document.getElementsByTagName("head")[0]
                          ?? document.getElementsByTagName("body")[0];

        if (documentHead == null) {
            throw new Error("Must be exists a node about <head> or <body> into html document.");
        }

        /** See Also, This is for additional features in addition to inserting assets. */
        this.headInjectors.forEach(func => func.perform(compilation, documentHead));

        for (const asset in compilation.assets) {
            /** To ensure compatibility with webpack-dev-server. */
            if (asset.endsWith("hot-update.js")) {
                continue;
            }

            const source = compilation.assets[asset].source() as string;
            const active = this.assetInjectors.get(path.extname(asset));
            if (active) {
                active.perform({compilation, assetName: asset, assetSource: source}, documentHead);
            }
        }

        return document.outerHTML;
    }

    /** Outputs an asset file by a given filename and file contents. */
    output(compilation: Compilation, filename: string, data: string) {
        compilation.emitAsset(filename, new sources.RawSource(data));
    }
}