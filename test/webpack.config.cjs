const HTMLInlinePlugin = require("html-inline-webpack-plugin");
const CSSExtractPlugin = require("mini-css-extract-plugin");

/** @type {import("webpack").Configuration} */
const config = {
    mode: "production",
    entry: "./src/index.js",
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
            pretty: true,
        })
    ]
}

module.exports = config;