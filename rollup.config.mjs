import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const plugins = [
    typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true
    }),
    terser(),
]

/** @type {import("rollup").RollupOptions} */
export default {
    plugins: plugins,
    input: "./src/index.ts",
    output: [
        { file: "./dist/index.esm.js", format: "esm", name: "HTMLInlineWebpackPlugin" },
        { file: "./dist/index.umd.js", format: "umd", name: "HTMLInlineWebpackPlugin" }
    ]
}