import { HTMLElement } from "node-html-parser";
import { AssetInjector, AssetInjectorContext } from "./asset_injector";
import { HTMLInlineWebpackPluginScriptLoading } from "../types";

export abstract class AssetInsertorWithBlob<T> extends AssetInjector<T> {
    abstract createBlobSource(context: AssetInjectorContext<T>): string;
}

export abstract class DrivenAssetInjectorWithBlob extends AssetInsertorWithBlob<string> {
    createBlobSource(context: AssetInjectorContext<string>): string {
        return context.assetSource
            .replaceAll("`", "\\`")
            .replaceAll("$", "\\$");
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
        const blobSrc = this.createBlobSource(context);
        const loading = this.options.scriptLoading;
        const element = new HTMLElement("script", {});
        element.textContent = `{
            const blob = new Blob([String.raw\`${blobSrc}\`], {type: "application/javascript"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("script");
            element.setAttribute("src", blobUrl);
            ${
                // To defines an optional attributes about script loading behavior.
                loading != "DEFAULT"
                    ? `element.setAttribute("${loading == "DEFER" ? "defer" : loading == "ASYNC" ? "async" : ""}", "");`
                    : ``
            }

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
            const blob = new Blob([String.raw\`${blobSrc}\`], {type: "text/css"});
            const blobUrl = window.URL.createObjectURL(blob);
            const element = document.createElement("link");
            element.setAttribute("href", blobUrl);
            element.setAttribute("rel", "stylesheet");

            document.head.appendChild(element);
        }`;

        return element;
    }
}