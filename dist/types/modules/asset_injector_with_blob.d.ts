import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";
import { HTMLInlineWebpackPluginScriptLoading } from "../types";
export declare abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobSource(context: AssetInjectorContext<T>): string;
}
export declare abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createBlobSource(context: AssetInjectorContext<string>): string;
    perform(context: AssetInjectorContext, parent: HTMLElement): void;
}
export declare class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    options: {
        scriptLoading: HTMLInlineWebpackPluginScriptLoading;
    };
    constructor(options: {
        scriptLoading: HTMLInlineWebpackPluginScriptLoading;
    });
    createElement(context: AssetInjectorContext): HTMLElement;
}
export declare class StyleAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    createElement(context: AssetInjectorContext<string>): HTMLElement;
}
