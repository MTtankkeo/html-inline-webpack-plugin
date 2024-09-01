import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";

export abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobSource(context: AssetInjectorContext<T>): string;
}

export abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createBlobSource(context: AssetInjectorContext<string>): string {
        return context.assetSource.replaceAll("`", "\\`");
    }

    perform(context: AssetInjectorContext, parent: HTMLElement): void {
        parent.appendChild(this.createElement(context));
    }
}

export class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    createElement(context: AssetInjectorContext): HTMLElement {
        const blobSrc = this.createBlobSource(context);
        const element = new HTMLElement("script", {});
        element.textContent = `
            const blob = new Blob([\`${blobSrc}\`], {type: "application/javascript"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("script");
            element.setAttribute("src", blobUrl);
            element.setAttribute("defer", "");

            document.head.appendChild(element);
        `;

        return element;
    }
}