import { HTMLElement } from "node-html-parser";

/** This class provides the function of injecting an element into the <head> of a given document. */
export abstract class HeadInjector {
    abstract perform(parent: HTMLElement): void;
}

/**
 * This class performs the function of injecting an element that define
 * the favicon request path of a given html document.
 */
export class FavIconInjector extends HeadInjector {
    constructor(public path: string) {
        super();
    }

    perform(parent: HTMLElement): void {
        parent.appendChild(new HTMLElement("link", {}, `rel="shortcut icon" href="${this.path}"`));
    }
}