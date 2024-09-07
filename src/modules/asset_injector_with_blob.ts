import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";
import { HTMLInlineWebpackPluginScriptLoading } from "../types";
import { StringUtil } from "../utils/string";

export abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobSource(context: AssetInjectorContext<T>): string;
}

export abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createBlobSource(context: AssetInjectorContext<string>): string {
        return StringUtil.rawStringOf(context.assetSource);
    }

    perform(context: AssetInjectorContext, parent: HTMLElement): void {
        parent.appendChild(this.createElement(context));
    }
}

export class ScriptAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    constructor(public options: {scriptLoading: HTMLInlineWebpackPluginScriptLoading}) {
        super();
    }

    createElement(context: AssetInjectorContext): HTMLElement {
        const loading = this.options.scriptLoading;
        if (loading != "DEFAULT") {
            context.assetSource = `
                ${context.assetSource}

                // Since 'DOMContentLoaded' has already been called, any related callback functions registered
                // afterwards may not be properly executed according to the existing document flow.
                //
                // Therefore, the event needs to be artificially triggered again.
                dispatchEvent(new Event("DOMContentLoaded"));
            `;
        }

        const element = new HTMLElement("script", {});
        const blobSrc = this.createBlobSource(context);

        element.textContent = `{
            const blob = new Blob([${blobSrc}], {type: "application/javascript"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("script");
            element.setAttribute("src", blobUrl);

            document.head.appendChild(element);
        }`;

        return element;
    }
}

export class StyleAssetInjectorWithBlob extends DrivenAssetInjectorWithBlob {
    createElement(context: AssetInjectorContext<string>): HTMLElement {
        const blobSrc = this.createBlobSource(context);
        const element = new HTMLElement("script", {});
        element.textContent = `{
            const blob = new Blob([${blobSrc}], {type: "text/css"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("link");
            element.setAttribute("href", blobUrl);
            element.setAttribute("rel", "stylesheet");

            document.head.appendChild(element);
        }`;

        return element;
    }
}