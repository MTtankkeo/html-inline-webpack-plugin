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
export declare abstract class AssetInjector<T> {
    abstract createElement(): HTMLElement;
    abstract perform(context: AssetInjectorContext, parent: HTMLElement, source: T): void;
}
/** This class provides injecting HTML elements about asset based on the string. */
export declare abstract class DrivenAssetInjector extends AssetInjector<string> {
    options: {
        inline: boolean;
    };
    constructor(options: {
        inline: boolean;
    });
    /** Whether to include asset data within the tag for synchronous data loading. */
    get isInline(): boolean;
    perform(context: AssetInjectorContext, parent: HTMLElement, source: string): void;
    abstract setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}
export declare class ScriptAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement;
    setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}
export declare class StyleAssetInjector extends DrivenAssetInjector {
    createElement(): HTMLElement;
    setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}
