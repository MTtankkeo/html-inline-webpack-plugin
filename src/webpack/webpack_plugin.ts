import { Compilation, Compiler, sources } from "webpack";
import { HTMLElement, parse } from "node-html-parser";
import { format } from "prettier"
import path from "path";
import fs from "fs";

/** Signature for the interface that defines option values of [HTMLInlineWebpackPlugin]. */
export interface HTMLInlineWebpackPluginOptions {
    /** The path of the HTML document to finally insert an assets. */
    template: string;
    /** The path of the HTML document that is outputed finally. */
    filename: string;
    inject?: boolean;
    inline?: boolean;
    pretty?: boolean;
    processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
}

/** This webpack plugin package is bundling related HTML files by injecting inline tags. */
export class HTMLInlineWebpackPlugin {
    constructor(public options: HTMLInlineWebpackPluginOptions) {}

    apply(compiler: Compiler) {
        const mode = compiler.options.mode;
        const template = this.options?.template ?? "./src/index.html"; // input or entry
        const filename = this.options?.filename ?? "index.html";       // output or exit
        const inject = this.options?.inject ?? true;
        const inline = this.options?.inline ?? mode == "production";
        const pretty = this.options?.pretty ?? false;
        const processStage = this.options.processStage ?? "OPTIMIZE_INLINE"

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
                fs?.readFile(path.resolve(template), "utf-8", async (err, data) => {
                    if (err) {
                        throw new Error(`Exception while reading files: ${err.message}`);
                    }

                    if (inject) {
                        const injected = this.inject(compilation, data as string, inline);
                        const resulted = pretty ? await format(injected, {parser: "html"}) : injected;

                        this.output(compilation, filename, resulted);
                    }

                    callback();
                });
            });
        });
    }

    /** Inserts the content of assets as inline into a given HTML document in head or body. */
    inject(compilation: Compilation, docText: string, inline: boolean): string {
        const document = parse(docText);
        const documentHead = document.getElementsByTagName("head")[0]
                          ?? document.getElementsByTagName("body")[0];

        if (documentHead == null) {
            throw new Error("Must be exists a node about <head> or <body> into html document.");
        }

        for (const asset in compilation.assets) {
            if (path.extname(asset) == ".js") { // is javascript
                const source = compilation.assets[asset].source() as string;
                const script = new HTMLElement("script", {});

                if (inline) {
                    script.textContent = source;
                    compilation.deleteAsset(asset);
                } else {
                    script.setAttribute("src", asset);
                }

                documentHead.appendChild(script);
            } else if (path.extname(asset) == ".css") { // is style sheet about CSS.
                const source = compilation.assets[asset].source() as string;
                const styles = new HTMLElement("style", {});

                if (inline) {
                    styles.textContent = source;
                    compilation.deleteAsset(asset);
                } else {
                    styles.setAttribute("src", asset);
                }

                documentHead.appendChild(styles);
            }
        }

        return document.outerHTML;
    }

    /** Outputs an asset file by a given filename and file contents. */
    output(compilation: Compilation, filename: string, data: string) {
        compilation.emitAsset(filename, new sources.RawSource(data));
    }
}