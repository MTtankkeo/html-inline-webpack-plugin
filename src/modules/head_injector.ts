import { HTMLElement } from "node-html-parser";
import { Compilation, sources } from "webpack";
import path from "path";
import fs from "fs";

/** This class provides the function of injecting an element into the <head> of a given document. */
export abstract class HeadInjector {
    abstract perform(compilation: Compilation, parent: HTMLElement): void;
}

/**
 * This class performs the function of injecting an element that define
 * the favicon request path of a given html document.
 */
export class FavIconInjector extends HeadInjector {
    constructor(public path: string) {
        super();
    }

    /** Gets an output path for a given favicon source path. */
    get assetName(): string {
        return path.basename(this.path);
    }

    perform(compilation: Compilation, parent: HTMLElement): void {
        this.performAsset(compilation);

        // Settings a favicon path by injecting into HTML template as link.
        parent.appendChild(new HTMLElement("link", {}, `rel="shortcut icon" href="${this.assetName}"`));
    }

    performAsset(compilation: Compilation) {
        fs.readFile(this.path, (err, data) => {
            if (err) {
                throw new Error(`Exception while reading the file of a given favicon path: ${err.message}`);
            }

            compilation.emitAsset(this.assetName, new sources.RawSource(data));
        });
    }
}