import { HTMLElement } from "node-html-parser";
export declare abstract class HeadInjector {
    abstract perform(parent: HTMLElement): void;
}
export declare class FavIconInjector extends HeadInjector {
    path: string;
    constructor(path: string);
    perform(parent: HTMLElement): void;
}
