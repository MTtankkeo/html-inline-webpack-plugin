<div align="center">
  <img width="200px" src="https://github.com/user-attachments/assets/67559b48-8749-4ce8-b4b6-9d5505e0556e">
  <h1>HTML Inline Webpack Plugin</h1>
  <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.0.0</th>
          </tr>
        </tbody>
    </table>
</div>

# Introduction
This webpack plugin package is bundling related HTML files by injecting inline tags.

> [!WARNING]<br>
> This plugin is not compatible with `webpack-dev-server` if using "inline" option, please ensure that "inline" option is explicitly set to false during development. This option should only be used in production mode.

> See Also, If you want the change-log by version for this package. refer to [Change Log](CHANGELOG.md) for details.

## Support Current Status
| Type | Status | Support |
| ---- | ------ | ------- |
| Script | Tested for required dev-enviorment. | ✅ |
| Styles | Tested for required dev-enviorment. | ✅ |
| Others | Not supported, but you can to notify to me by GitBub issues. | 🟥 |

# Install by NPM
To install this package in your project, enter the following command.

> When you want to update this package, enter `npm update html-inline-webpack-plugin --save` in the terminal to run it.

```
npm install html-inline-webpack-plugin --save-dev
```

## And then In webpack.config.js
```cjs
// In webpack.config.js
const HTMLInlinePlugin = require("html-inline-webpack-plugin");

module.exports = {
  // Add an instance of HTMLInlinePlugin to plugins property value.
  plugins: [new HTMLInlinePlugin({...})]
}
```

## How is a bundle transpiled when this plugin applyed?
The example below demonstrates the simplest of many possible transformations.

### From
```html
<!-- When using html-webpack-plugin. -->
<script src="main.js" defer></script>
```

### From
But in reality, Additional code is inserted to address potential issues that may arise during the process of converting script into an inline format.

Therefore this is just a very simple example.

```html
<!-- When using this webpack plugin. (This example is a lot of omitted) -->
<script>
  addEventListener("DOMContentLoaded", () => console.log("This contents is into main.js"));
</script>
```

## The Properties of HTMLInlineWebpackPluginOptions

| Name | Description | type |
| ---- | ----------- | ---- |
| template | The path of the HTML document to finally insert an assets. | string |
| filename | The path of the HTML document that is outputed finally. | string |
| favicon? | The path of the favicon.ico file about the HTML document. | string |
| inject? | Whether the assets will ultimately be injected into the given HTML document template. | boolean |
| injcetType? | The type of the document element to which you want to inject the assets. | "HEAD" \| "BODY" |
| injectAsBlob? | Whether it loads and operates asynchronously in the same way as the existing method, but handles loading data as a blob to avoid re-requesting resources from the server. | boolean |
| inline? | Whether to reduce the number of resource requests to the server by injecting asset content all at once into the document template instead of using the traditional asynchronous request method. | boolean |
| pretty? | Not ready a comment about this. | boolean |
| processStage? | Not ready a comment about this. | "OPTIMIZE" \| "OPTIMIZE_INLINE" |
| scriptLoading? | Not ready a comment about this. | "DEFAULT" \| "LOADED" \| "DEFER" |
