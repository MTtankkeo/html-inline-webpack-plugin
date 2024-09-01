const HTMLInlinePlugin = require("html-inline-webpack-plugin");
const CSSExtractPlugin = require("mini-css-extract-plugin");

const BUILD_MODE = process.env["BUILD_MODE"];

/** @type {import("webpack").Configuration} */
const config = {
    mode: BUILD_MODE,
    entry: "./src/index.js",
    devServer: {hot: true},
    module: {
        rules: [
            { // for CSS.
                test: /\.css$/i,
                use: [CSSExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new CSSExtractPlugin(),
        new HTMLInlinePlugin({
            template: "./src/index.html",
            filename: "index.html",
            favIcon: "./src/assets/favicon.svg",
            injectAsBlob: true,
            inline: false,
            pretty: true
        }),
    ]
}

module.exports = config;