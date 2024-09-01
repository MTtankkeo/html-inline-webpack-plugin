import { HTMLElement } from "node-html-parser";
/** This class provides the function of injecting an element into the <head> of a given document. */
export declare abstract class HeadInjector {
    abstract perform(parent: HTMLElement): void;
}
/**
 * This class performs the function of injecting an element that define
 * the favicon request path of a given html document.
 */
export declare class FavIconInjector extends HeadInjector {
    path: string;
    constructor(path: string);
    perform(parent: HTMLElement): void;
}
