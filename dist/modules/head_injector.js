var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-html-parser", "webpack", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FavIconInjector = exports.HeadInjector = void 0;
    const node_html_parser_1 = require("node-html-parser");
    const webpack_1 = require("webpack");
    const path_1 = __importDefault(require("path"));
    const fs_1 = __importDefault(require("fs"));
    /** This class provides the function of injecting an element into the <head> of a given document. */
    class HeadInjector {
    }
    exports.HeadInjector = HeadInjector;
    /**
     * This class performs the function of injecting an element that define
     * the favicon request path of a given html document.
     */
    class FavIconInjector extends HeadInjector {
        path;
        constructor(path) {
            super();
            this.path = path;
        }
        /** Gets an output path for a given favicon source path. */
        get assetName() {
            return path_1.default.basename(this.path);
        }
        perform(compilation, parent) {
            this.performAsset(compilation);
            // Settings a favicon path by injecting into HTML template as link.
            parent.appendChild(new node_html_parser_1.HTMLElement("link", {}, `rel="shortcut icon" href="${this.assetName}"`));
        }
        async performAsset(compilation) {
            try {
                const buffer = fs_1.default.readFileSync(this.path);
                compilation.emitAsset(this.assetName, new webpack_1.sources.RawSource(buffer));
            }
            catch (err) {
                throw new Error(`Exception while reading the file of a given favicon path: ${err.message}`);
            }
        }
    }
    exports.FavIconInjector = FavIconInjector;
});
