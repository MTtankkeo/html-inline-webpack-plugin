(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-html-parser", "./asset_injector", "../utils/string"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyleAssetInjectorWithBlob = exports.ScriptAssetInjectorWithBlob = exports.DrivenAssetInjectorWithBlob = exports.AssetInsertorWithBlob = void 0;
    const node_html_parser_1 = require("node-html-parser");
    const asset_injector_1 = require("./asset_injector");
    const string_1 = require("../utils/string");
    class AssetInsertorWithBlob extends asset_injector_1.AssetInjector {
    }
    exports.AssetInsertorWithBlob = AssetInsertorWithBlob;
    class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob {
        createBlobSource(context) {
            return string_1.StringUtil.rawStringOf(context.assetSource);
        }
        perform(context, parent) {
            parent.appendChild(this.createElement(context));
        }
    }
    exports.DrivenAssetInjectorWithBlob = DrivenAssetInjectorWithBlob;
    class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
        options;
        constructor(options) {
            super();
            this.options = options;
        }
        createElement(context) {
            const loading = this.options.scriptLoading;
            if (loading != "DEFAULT") {
                context.assetSource = `
                ${context.assetSource}

                // Since 'DOMContentLoaded' has already been called, any related callback functions registered
                // afterwards may not be properly executed according to the existing document flow.
                //
                // Therefore, the event needs to be artificially triggered again.
                dispatchEvent(new Event("DOMContentLoaded"));
            `;
            }
            const element = new node_html_parser_1.HTMLElement("script", {});
            const blobSrc = this.createBlobSource(context);
            element.textContent = `{
            const blob = new Blob([${blobSrc}], {type: "application/javascript"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("script");
            element.setAttribute("src", blobUrl);

            document.head.appendChild(element);
        }`;
            return element;
        }
    }
    exports.ScriptAssetInjectorWithBlob = ScriptAssetInjectorWithBlob;
    class StyleAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
        createElement(context) {
            const blobSrc = this.createBlobSource(context);
            const element = new node_html_parser_1.HTMLElement("script", {});
            element.textContent = `{
            const blob = new Blob([${blobSrc}], {type: "text/css"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("link");
            element.setAttribute("href", blobUrl);
            element.setAttribute("rel", "stylesheet");

            document.head.appendChild(element);
        }`;
            return element;
        }
    }
    exports.StyleAssetInjectorWithBlob = StyleAssetInjectorWithBlob;
});
