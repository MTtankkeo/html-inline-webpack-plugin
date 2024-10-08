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
export declare abstract class AssetInjector<T> {
    abstract createElement(context: AssetInjectorContext<T>): HTMLElement;
    abstract perform(context: AssetInjectorContext<T>, parent: HTMLElement): void;
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
    abstract createSource(context: AssetInjectorContext): string;
    abstract setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
    perform(context: AssetInjectorContext, parent: HTMLElement): void;
}
/** This class performs injecting HTML element about javascript assets. */
export declare class ScriptAssetInjector extends DrivenAssetInjector {
    options: {
        inline: boolean;
        scriptLoading: HTMLInlineWebpackPluginScriptLoading;
    };
    constructor(options: {
        inline: boolean;
        scriptLoading: HTMLInlineWebpackPluginScriptLoading;
    });
    createSource(context: AssetInjectorContext): string;
    createElement(): HTMLElement;
    setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}
/** This class performs injecting HTML elements about CSS style sheet assets. */
export declare class StyleAssetInjector extends DrivenAssetInjector {
    createSource(context: AssetInjectorContext): string;
    createElement(): HTMLElement;
    setAttribute(context: AssetInjectorContext, element: HTMLElement): void;
}
