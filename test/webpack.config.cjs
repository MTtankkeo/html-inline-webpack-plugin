const HTMLInlinePlugin = require("html-inline-webpack-plugin").default;

/** @type {import("webpack").Configuration} */
const config = {
    mode: "production",
    entry: "./src/index.js",
    plugins: [
        new HTMLInlinePlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ]
}

module.exports = config;