(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-html-parser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyleAssetInjector = exports.ScriptAssetInjector = exports.DrivenAssetInjector = exports.AssetInjector = void 0;
    const node_html_parser_1 = require("node-html-parser");
    /** This class provides injecting HTML elements about asset. */
    class AssetInjector {
    }
    exports.AssetInjector = AssetInjector;
    /** This class provides injecting HTML elements about asset based on the string. */
    class DrivenAssetInjector extends AssetInjector {
        options;
        constructor(options) {
            super();
            this.options = options;
        }
        /** Whether to include asset data within the tag for synchronous data loading. */
        get isInline() {
            return this.options.inline;
        }
        perform(context, parent, source) {
            const target = this.createElement();
            if (this.isInline) {
                target.textContent = source;
                context.compilation.deleteAsset(context.assetName);
            }
            else {
                this.setAttribute(context, target);
            }
            parent.appendChild(target);
        }
    }
    exports.DrivenAssetInjector = DrivenAssetInjector;
    class ScriptAssetInjector extends DrivenAssetInjector {
        createElement() {
            return new node_html_parser_1.HTMLElement("script", {});
        }
        setAttribute(context, element) {
            element.setAttribute("defer", "");
            element.setAttribute("src", context.assetName);
        }
    }
    exports.ScriptAssetInjector = ScriptAssetInjector;
    class StyleAssetInjector extends DrivenAssetInjector {
        createElement() {
            return new node_html_parser_1.HTMLElement(this.isInline ? "style" : "link", {});
        }
        setAttribute(context, element) {
            element.setAttribute("href", context.assetName);
            element.setAttribute("rel", "stylesheet");
        }
    }
    exports.StyleAssetInjector = StyleAssetInjector;
});
