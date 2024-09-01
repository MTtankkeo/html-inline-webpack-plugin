(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-html-parser", "./asset_injector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScriptAssetInjectorWithBlob = exports.DrivenAssetInjectorWithBlob = exports.AssetInsertorWithBlob = void 0;
    const node_html_parser_1 = require("node-html-parser");
    const asset_injector_1 = require("./asset_injector");
    class AssetInsertorWithBlob extends asset_injector_1.AssetInjector {
    }
    exports.AssetInsertorWithBlob = AssetInsertorWithBlob;
    class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob {
        createBlobSource(context) {
            return context.assetSource.replaceAll("`", "\\`");
        }
        perform(context, parent) {
            parent.appendChild(this.createElement(context));
        }
    }
    exports.DrivenAssetInjectorWithBlob = DrivenAssetInjectorWithBlob;
    class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
        createElement(context) {
            const blobSrc = this.createBlobSource(context);
            const element = new node_html_parser_1.HTMLElement("script", {});
            element.textContent = `
            const blob = new Blob([\`${blobSrc}\`], {type: "application/javascript"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("script");
            element.setAttribute("src", blobUrl);
            element.setAttribute("defer", "");

            document.head.appendChild(element);
        `;
            return element;
        }
    }
    exports.ScriptAssetInjectorWithBlob = ScriptAssetInjectorWithBlob;
});
