import { HTMLElement } from "node-html-parser";
import { Compilation } from "webpack";

export interface AssetInjectorContext {
    compilation: Compilation;
    assetName: string;
}

export abstract class AssetInjector<T> {
    abstract createElement(): HTMLElement;
    abstract perform(context: AssetInjectorContext, parent: HTMLElement, source: T): void;
}

export interface DrivenAssetInjectorOptions {
    inline: boolean;
}

export abstract class DrivenAssetInjector extends AssetInjector<string> {
    constructor(public options: DrivenAssetInjectorOptions) {
        super();
    }

    get isInline(): boolean {
        return this.options.inline;
    }

    perform(context: AssetInjectorContext, parent: HTMLElement, source: string): void {
        const target = this.createElement();

        if (this.isInline) {
            target.textContent = source;
            context.compilation.deleteAsset(context.assetName);
        } else {
            target.setAttribute("src", context.assetName);
        }

        parent.appendChild(target);
    }
}

export class ScriptAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement {
        return new HTMLElement("script", {});
    }
}

export class StyleAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement {
        return new HTMLElement("style", {});
    }
}