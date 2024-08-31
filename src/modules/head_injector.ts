import { HTMLElement } from "node-html-parser";

export abstract class HeadInjector {
    abstract perform(parent: HTMLElement): void;
}

export class FavIconInjector extends HeadInjector {
    constructor(public path: string) {
        super();
    }

    perform(parent: HTMLElement): void {
        parent.appendChild(new HTMLElement("link", {}, `rel="shortcut icon" href="${this.path}"`));
    }
}