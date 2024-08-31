import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";
export declare abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobObject(context: AssetInjectorContext<T>): string;
}
export declare abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createElement(context: AssetInjectorContext): HTMLElement;
    perform(context: AssetInjectorContext, parent: HTMLElement): void;
}
export declare class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    createBlobObject(context: AssetInjectorContext): string;
}
