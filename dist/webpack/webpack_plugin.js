var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "webpack", "node-html-parser", "prettier", "../modules/asset_injector", "../modules/head_injector", "../modules/asset_injector_with_blob", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLInlineWebpackPlugin = void 0;
    const webpack_1 = require("webpack");
    const node_html_parser_1 = require("node-html-parser");
    const prettier_1 = require("prettier");
    const asset_injector_1 = require("../modules/asset_injector");
    const head_injector_1 = require("../modules/head_injector");
    const asset_injector_with_blob_1 = require("../modules/asset_injector_with_blob");
    const path_1 = __importDefault(require("path"));
    const fs_1 = __importDefault(require("fs"));
    /** This webpack plugin package is bundling related HTML files by injecting inline tags. */
    class HTMLInlineWebpackPlugin {
        options;
        assetInjectors = new Map();
        headInjectors = [];
        constructor(options) {
            this.options = options;
            // TODO: ...
        }
        applyContext(options) {
            /** Whether asset resource should be inserted in blob form. */
            const isInjectAsBlob = options.injectAsBlob;
            this.assetInjectors.set(".js", isInjectAsBlob
                ? new asset_injector_with_blob_1.ScriptAssetInjectorWithBlob({ scriptLoading: options.scriptLoading })
                : new asset_injector_1.ScriptAssetInjector({ inline: options.inline, scriptLoading: options.scriptLoading }));
            this.assetInjectors.set(".css", isInjectAsBlob
                ? new asset_injector_with_blob_1.StyleAssetInjectorWithBlob()
                : new asset_injector_1.StyleAssetInjector({ inline: options.inline }));
            if (options.favicon != "") {
                this.headInjectors.push(new head_injector_1.FavIconInjector(options.favicon));
            }
        }
        apply(compiler) {
            const mode = compiler.options.mode;
            const template = this.options?.template ?? "./src/index.html"; // input or entry
            const filename = this.options?.filename ?? "index.html"; // output or exit
            const favicon = this.options?.favicon ?? "";
            const inject = this.options?.inject ?? true;
            const injectType = this.options.injectType ?? "HEAD";
            const injectAsBlob = this.options?.injectAsBlob ?? false;
            const inline = this.options?.inline ?? mode == "production"; // by web-dev-server
            const pretty = this.options?.pretty ?? false;
            const processStage = this.options.processStage ?? "OPTIMIZE_INLINE";
            const scriptLoading = this.options.scriptLoading ?? "DEFER";
            this.applyContext({
                template: template,
                filename: filename,
                favicon: favicon,
                inject: inject,
                injectType: injectType,
                injectAsBlob: injectAsBlob,
                inline: inline,
                pretty: pretty,
                processStage: processStage,
                scriptLoading: scriptLoading,
            });
            if (inject && path_1.default.extname(template) != ".html") {
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
                    fs_1.default.readFile(path_1.default.resolve(template), "utf-8", async (err, data) => {
                        if (err) {
                            throw new Error(`Exception while reading the file of a given HTML template path: ${err.message}`);
                        }
                        if (inject) {
                            const injected = this.inject(compilation, data, injectType);
                            const formated = pretty ? await (0, prettier_1.format)(injected, { parser: "html" }) : injected;
                            this.output(compilation, filename, formated);
                        }
                        callback();
                    });
                });
            });
        }
        /** Inserts the content of assets as inline into a given HTML document in head or body. */
        inject(compilation, docText, injectType) {
            const document = (0, node_html_parser_1.parse)(docText);
            const elements = injectType == "HEAD"
                ? document.getElementsByTagName("head")[0] ?? document.getElementsByTagName("body")[0]
                : document.getElementsByTagName("body")[0] ?? document.getElementsByTagName("head")[0];
            if (elements == null) {
                throw new Error("Must be exists a node about <head> or <body> into html document.");
            }
            /** See Also, This is for additional features in addition to inserting assets. */
            this.headInjectors.forEach(func => func.perform(compilation, elements));
            for (const asset in compilation.assets) {
                /** To ensure compatibility with webpack-dev-server. */
                if (asset.endsWith("hot-update.js")) {
                    continue;
                }
                const source = compilation.assets[asset].source();
                const active = this.assetInjectors.get(path_1.default.extname(asset));
                if (active) {
                    active.perform({ compilation, assetName: asset, assetSource: source }, elements);
                }
            }
            return document.outerHTML;
        }
        /** Outputs an asset file by a given filename and file contents. */
        output(compilation, filename, data) {
            compilation.emitAsset(filename, new webpack_1.sources.RawSource(data));
        }
    }
    exports.HTMLInlineWebpackPlugin = HTMLInlineWebpackPlugin;
});
