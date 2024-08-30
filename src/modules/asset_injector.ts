import { HTMLElement } from "node-html-parser";
import { Compilation } from "webpack";

/**
 * Signature for the interface that defines the required information
 * for injecting HTML elements about asset.
 * 
 * Used by [AssetInjector].
 */
export interface AssetInjectorContext {
    compilation: Compilation;
    assetName: string;
}

/** This class provides injecting HTML elements about asset. */
export abstract class AssetInjector<T> {
    abstract createElement(): HTMLElement;
    abstract perform(context: AssetInjectorContext, parent: HTMLElement, source: T): void;
}

/** This class provides injecting HTML elements about asset based on the string. */
export abstract class DrivenAssetInjector extends AssetInjector<string> {
    constructor(public options: {inline: boolean}) {
        super();
    }

    /** Whether to include asset data within the tag for synchronous data loading. */
    get isInline(): boolean {
        return this.options.inline;
    }

    perform(context: AssetInjectorContext, parent: HTMLElement, source: string): void {
        const target = this.createElement();

        if (this.isInline) {
            target.textContent = source;
            context.compilation.deleteAsset(context.assetName);
        } else {
            this.setAttribute(context, target);
        }

        parent.appendChild(target);
    }

    abstract setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}

export class ScriptAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement {
        return new HTMLElement("script", {});
    }

    setAttribute(context: AssetInjectorContext, element: HTMLElement): void {
        element.setAttribute("defer", "");
        element.setAttribute("src", context.assetName);
    }
}

export class StyleAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement {
        return new HTMLElement("link", {});
    }

    setAttribute(context: AssetInjectorContext, element: HTMLElement): void {
        element.setAttribute("href", context.assetName);
        element.setAttribute("rel", "stylesheet");
    }
}