import { HTMLElement } from "node-html-parser";
import { Compilation } from "webpack";
/** This class provides the function of injecting an element into the <head> of a given document. */
export declare abstract class HeadInjector {
    abstract perform(compilation: Compilation, parent: HTMLElement): void;
}
/**
 * This class performs the function of injecting an element that define
 * the favicon request path of a given html document.
 */
export declare class FavIconInjector extends HeadInjector {
    path: string;
    constructor(path: string);
    /** Gets an output path for a given favicon source path. */
    get assetName(): string;
    perform(compilation: Compilation, parent: HTMLElement): void;
    performAsset(compilation: Compilation): Promise<void>;
}
