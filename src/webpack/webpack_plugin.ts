import { Compilation, Compiler, sources } from "webpack";
import { HTMLElement, parse } from "node-html-parser";
import { format } from "prettier"
import path from "path";
import fs from "fs";

export class HTMLInlineWebpackPlugin {
    constructor(public options: {
        template: string;
        filename: string;
        inject?: boolean;
        inline?: boolean;
        pretty?: boolean;
        processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
    }) {}

    apply(compiler: Compiler) {
        const mode = compiler.options.mode;
        const template = this.options?.template ?? "./src/index.html"; // input or entry
        const filename = this.options?.filename ?? "index.html";       // output or exit
        const inject = this.options?.inject ?? true;
        const inline = this.options?.inline ?? mode == "production";
        const pretty = this.options?.pretty ?? false;
        const processStage = this.options.processStage ?? "OPTIMIZE_INLINE"

        if (inject && path.extname(template) != ".html") {
            throw new Error("A given path of [template] is not an HTML document file format.");
        }

        compiler.hooks.compilation.tap("HTMLInlineWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: "HTMLInlineWebpackPlugin",
                stage: processStage == "OPTIMIZE_INLINE"
                    ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                    : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (_, callback) => {
                fs?.readFile(path.resolve(template), "utf-8", async (err, data) => {
                    if (err) {
                        throw new Error(`Exception while reading files: ${err.message}`);
                    }

                    if (inject) {
                        const injected = this.inject(compilation, data as string, inline);
                        const resulted = pretty ? await format(injected, {parser: "html"}) : injected;

                        this.output(compilation, filename, resulted);
                    }

                    callback();
                });
            });
        });
    }

    inject(compilation: Compilation, docText: string,  inline: boolean): string {
        const document = parse(docText);
        const documentHead = document.getElementsByTagName("body")[0];

        for (const asset in compilation.assets) {
            if (path.extname(asset) == ".js") { // is javascript
                const source = compilation.assets[asset].source() as string;
                const script = new HTMLElement("script", {});

                if (inline) {
                    script.textContent = source;
                    compilation.deleteAsset(asset);
                } else {
                    script.setAttribute("src", asset);
                }

                documentHead.appendChild(script);
            }
        }

        return document.outerHTML;
    }

    output(compilation: Compilation, filename: string, data: string) {
        compilation.emitAsset(filename, new sources.RawSource(data));
    }
}