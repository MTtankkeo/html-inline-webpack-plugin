import { Compilation, Compiler } from "webpack";
import { HTMLInlineWebpackPluginInjectingType, HTMLInlineWebpackPluginScriptLoading } from "../types";
/** Signature for the interface that defines option values of [HTMLInlineWebpackPlugin]. */
export interface HTMLInlineWebpackPluginOptions {
    /** The path of the HTML document to finally inject an assets. */
    template: string;
    /** The path of the HTML document that is outputed finally. */
    filename: string;
    /** The path of the favicon.ico file about the HTML document. */
    favIcon?: string;
    /** Whether the assets will ultimately be injected into the given HTML document template. */
    inject?: boolean;
    /** The type of the document element to which you want to inject the assets. */
    injectType?: HTMLInlineWebpackPluginInjectingType;
    /**
     * Whether it loads and operates asynchronously in the same way as the existing method,
     * but handles loading data as a blob to avoid re-requesting resources from the server.
     */
    injectAsBlob: boolean;
    /**
     * Whether to reduce the number of resource requests to the server by injecting
     * asset content all at once into the document template instead of using
     * the traditional asynchronous request method.
     *
     * By default, it is set to `true`, but in development mode, it is exceptionally defined as `false`.
     *
     * ```html
     * <!-- is false. -->
     * <script src="main.js"></script>
     *
     * <!-- is true. -->
     * <script>console.log("Hello, World!");</script>
     * ```
     */
    inline?: boolean;
    pretty?: boolean;
    processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
    scriptLoading?: HTMLInlineWebpackPluginScriptLoading;
}
/** This webpack plugin package is bundling related HTML files by injecting inline tags. */
export declare class HTMLInlineWebpackPlugin {
    options: HTMLInlineWebpackPluginOptions;
    private assetInjectors;
    private headInjectors;
    constructor(options: HTMLInlineWebpackPluginOptions);
    applyContext(options: Required<HTMLInlineWebpackPluginOptions>): void;
    apply(compiler: Compiler): void;
    /** Inserts the content of assets as inline into a given HTML document in head or body. */
    inject(compilation: Compilation, docText: string, injectType: HTMLInlineWebpackPluginInjectingType): string;
    /** Outputs an asset file by a given filename and file contents. */
    output(compilation: Compilation, filename: string, data: string): void;
}
