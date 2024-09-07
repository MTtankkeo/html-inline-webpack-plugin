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
        perform(context, parent) {
            const target = this.createElement(context);
            if (this.isInline) {
                target.textContent = this.createSource(context);
                // A given asset has already been inserted into the document,
                // so there is no need to output it separately.
                context.compilation.deleteAsset(context.assetName);
            }
            else {
                this.setAttribute(context, target);
            }
            parent.appendChild(target);
        }
    }
    exports.DrivenAssetInjector = DrivenAssetInjector;
    /** This class performs injecting HTML element about javascript assets. */
    class ScriptAssetInjector extends DrivenAssetInjector {
        options;
        constructor(options) {
            super(options);
            this.options = options;
        }
        createSource(context) {
            if (this.options.scriptLoading == "DEFAULT") {
                return context.assetSource;
            }
            else { // is "DEFER" and "ASYNC"
                return `{
                let __LISTENER__;
                addEventListener("DOMContentLoaded", __LISTENER__ = function() {
                    ${context.assetSource}

                    // Remove previous registered existing callback function.
                    removeEventListener("DOMContentLoaded", __LISTENER__);

                    // Since 'DOMContentLoaded' has already been called, any related callback functions registered
                    // afterwards may not be properly executed according to the existing document flow.
                    //
                    // Therefore, the event needs to be artificially triggered again.
                    dispatchEvent(new Event("DOMContentLoaded"));
                });
            }`;
            }
        }
        createElement() {
            return new node_html_parser_1.HTMLElement("script", {});
        }
        setAttribute(context, element) {
            switch (this.options.scriptLoading) {
                case "DEFER":
                    element.setAttribute("defer", "");
                    break;
                case "ASYNC":
                    element.setAttribute("async", "");
                    break;
                case "DEFAULT": break;
            }
            element.setAttribute("src", context.assetName);
        }
    }
    exports.ScriptAssetInjector = ScriptAssetInjector;
    /** This class performs injecting HTML elements about CSS style sheet assets. */
    class StyleAssetInjector extends DrivenAssetInjector {
        createSource(context) {
            return context.assetSource;
        }
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
