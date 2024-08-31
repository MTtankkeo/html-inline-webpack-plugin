(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./asset_injector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetInsertorWithBlob = void 0;
    const asset_injector_1 = require("./asset_injector");
    class AssetInsertorWithBlob extends asset_injector_1.AssetInjector {
        blobOf() {
        }
    }
    exports.AssetInsertorWithBlob = AssetInsertorWithBlob;
});
