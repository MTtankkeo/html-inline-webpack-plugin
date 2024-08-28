import { Compilation, Compiler, OutputFileSystem, sources } from "webpack";
import path from "path";

export class HTMLInlineWebpackPlugin {
    constructor(public options: {
        template: string;
        filename: string;
        inject?: boolean;
        processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
    }) {}

    apply(compiler: Compiler) {
        const template = this.options?.template ?? "./src/index.html"; // input or entry
        const filename = this.options?.filename ?? "index.html";       // output or exit
        const inject = this.options?.inject ?? true;
        const processStage = this.options.processStage ?? "OPTIMIZE_INLINE"

        if (inject && path.extname(template) != ".html") {
            throw new Error("A given path of [template] is not an HTML document file format.");
        }

        compiler.hooks.thisCompilation.tap("HTMLInlineWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: "HTMLInlineWebpackPlugin",
                stage: processStage == "OPTIMIZE_INLINE"
                    ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                    : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (_, callback) => {
                const fs = compiler.outputFileSystem;
                console.assert(fs != null, "Need to output file system in this webpack plugin.");

                fs?.readFile(path.resolve(template), "utf-8", (err, data) => {
                    if (err) {
                        throw err; // TODO: about it.
                    }

                    if (inject) {
                        this.inject(compilation, data as string);
                        this.output(compilation, filename, data as string);
                    }

                    callback();
                });
            });
        });
    }

    inject(compilation: Compilation, docText: string): string {
        for (const asset in compilation.assets) {
            if (path.extname(asset) == ".js") { // is javascript
                const source = compilation.assets[asset].source();
                console.log(source);
            }
        }

        return docText;
    }

    output(compilation: Compilation, filename: string, data: string) {
        compilation.emitAsset(filename, new sources.RawSource(data));
    }
}