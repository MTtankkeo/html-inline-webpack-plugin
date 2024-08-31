import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";

export abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobObject(context: AssetInjectorContext<T>): string;
}

export abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createElement(context: AssetInjectorContext): HTMLElement {
        const blobObj = this.createBlobObject(context);
        const element = new HTMLElement("script", {}, "");
        element.textContent = `
            const blob = ${blobObj};
            const bUrl = window.URL.createObjectURL(blob);
        `;

        return element;
    }

    perform(context: AssetInjectorContext, parent: HTMLElement): void {
        parent.appendChild(this.createElement(context));
    }
}

export class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    createBlobObject(context: AssetInjectorContext): string {
        return `new Blob([${context.assetSource}], {type: "application/javascript"})`;
    }
}