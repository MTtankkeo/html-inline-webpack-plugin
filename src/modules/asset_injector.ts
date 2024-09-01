import { HTMLElement } from "node-html-parser";
import { Compilation } from "webpack";
import { HTMLInlineWebpackPluginScriptLoading } from "../types";

/**
 * Signature for the interface that defines the required information
 * for injecting HTML elements about asset.
 * 
 * Used by [AssetInjector].
 */
export interface AssetInjectorContext<T = string> {
    compilation: Compilation;
    assetSource: T;
    assetName: string;
}

/** This class provides injecting HTML elements about asset. */
export abstract class AssetInjector<T> {
    abstract createElement(context: AssetInjectorContext<T>): HTMLElement;
    abstract perform(context: AssetInjectorContext<T>, parent: HTMLElement): void;
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

    perform(context: AssetInjectorContext, parent: HTMLElement): void {
        const target = this.createElement(context);

        if (this.isInline) {
            target.textContent = context.assetSource;

            // A given asset has already been inserted into the document,
            // so there is no need to output it separately.
            context.compilation.deleteAsset(context.assetName);
        } else {
            this.setAttribute(context, target);
        }

        parent.appendChild(target);
    }

    abstract setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}

/** This class performs injecting HTML element about javascript assets. */
export class ScriptAssetInjector extends DrivenAssetInjector {
    constructor(public options: {inline: boolean, scriptLoading: HTMLInlineWebpackPluginScriptLoading}) {
        super(options);
    }

    createElement(): HTMLElement {
        return new HTMLElement("script", {});
    }

    setAttribute(context: AssetInjectorContext, element: HTMLElement): void {
        switch (this.options.scriptLoading) {
            case "DEFER": element.setAttribute("defer", ""); break;
            case "ASYNC": element.setAttribute("async", ""); break;
            case "DEFAULT": break;
        }

        element.setAttribute("src", context.assetName);
    }
}

/** This class performs injecting HTML elements about CSS style sheet assets. */
export class StyleAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement {
        return new HTMLElement(this.isInline ? "style" : "link", {});
    }

    setAttribute(context: AssetInjectorContext, element: HTMLElement): void {
        element.setAttribute("href", context.assetName);
        element.setAttribute("rel", "stylesheet");
    }
}