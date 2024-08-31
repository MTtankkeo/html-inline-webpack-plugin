var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "webpack", "node-html-parser", "prettier", "path", "fs", "../modules/asset_injector", "../modules/head_injector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLInlineWebpackPlugin = void 0;
    const webpack_1 = require("webpack");
    const node_html_parser_1 = require("node-html-parser");
    const prettier_1 = require("prettier");
    const path_1 = __importDefault(require("path"));
    const fs_1 = __importDefault(require("fs"));
    const asset_injector_1 = require("../modules/asset_injector");
    const head_injector_1 = require("../modules/head_injector");
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
            this.assetInjectors.set(".js", new asset_injector_1.ScriptAssetInjector({ inline: options.inline }));
            this.assetInjectors.set(".css", new asset_injector_1.StyleAssetInjector({ inline: options.inline }));
            if (options.favIcon != null) {
                this.headInjectors.push(new head_injector_1.FavIconInjector(options.favIcon));
            }
        }
        apply(compiler) {
            const mode = compiler.options.mode;
            const template = this.options?.template ?? "./src/index.html"; // input or entry
            const filename = this.options?.filename ?? "index.html"; // output or exit
            const favIcon = this.options?.favIcon ?? "";
            const inject = this.options?.inject ?? true;
            const injectAsBlob = this.options?.injectAsBlob ?? false;
            const inline = this.options?.inline ?? mode == "production"; // by web-dev-server
            const pretty = this.options?.pretty ?? false;
            const processStage = this.options.processStage ?? "OPTIMIZE_INLINE";
            this.applyContext({
                template: template,
                filename: filename,
                favIcon: favIcon,
                inject: inject,
                injectAsBlob: injectAsBlob,
                inline: inline,
                pretty: pretty,
                processStage: processStage,
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
                    fs_1.default?.readFile(path_1.default.resolve(template), "utf-8", async (err, data) => {
                        if (err) {
                            throw new Error(`Exception while reading files: ${err.message}`);
                        }
                        if (inject) {
                            const injected = this.inject(compilation, data);
                            const resulted = pretty ? await (0, prettier_1.format)(injected, { parser: "html" }) : injected;
                            this.output(compilation, filename, resulted);
                        }
                        callback();
                    });
                });
            });
        }
        /** Inserts the content of assets as inline into a given HTML document in head or body. */
        inject(compilation, docText) {
            const document = (0, node_html_parser_1.parse)(docText);
            const documentHead = document.getElementsByTagName("head")[0]
                ?? document.getElementsByTagName("body")[0];
            if (documentHead == null) {
                throw new Error("Must be exists a node about <head> or <body> into html document.");
            }
            /** Insert the head for additional settings about a given information. */
            this.headInjectors.forEach(func => func.perform(documentHead));
            for (const asset in compilation.assets) {
                /** To ensure compatibility with webpack-dev-server. */
                if (asset.endsWith("hot-update.js")) {
                    continue;
                }
                const source = compilation.assets[asset].source();
                const active = this.assetInjectors.get(path_1.default.extname(asset));
                if (active) {
                    active.perform({ compilation, assetName: asset }, documentHead, source);
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
