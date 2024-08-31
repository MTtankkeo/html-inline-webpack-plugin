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
    exports.FavIconInjector = exports.HeadInjector = void 0;
    const node_html_parser_1 = require("node-html-parser");
    class HeadInjector {
    }
    exports.HeadInjector = HeadInjector;
    class FavIconInjector extends HeadInjector {
        path;
        constructor(path) {
            super();
            this.path = path;
        }
        perform(parent) {
            parent.appendChild(new node_html_parser_1.HTMLElement("link", {}, `rel="shortcut icon" href="${this.path}"`));
        }
    }
    exports.FavIconInjector = FavIconInjector;
});
