<div align="center">
  <img width="200px" src="https://github.com/user-attachments/assets/67559b48-8749-4ce8-b4b6-9d5505e0556e">
  <h1>HTML Inline Webpack Plugin</h1>
  <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.0.0-dev1</th>
          </tr>
        </tbody>
    </table>
</div>

# Description
This webpack plugin package is bundling related HTML files by injecting inline tags.

## Support Current Status
| Type | Status | Support |
| ---- | ------ | ------- |
| Script | Tested for required dev-enviorment. | ✅ |
| Styles | Not supported, But i'm developing currently... | 🟧 |
| Others | Not supported | 🟥 |

# Install by NPM
To install this package in your project, enter the following command.

> When you want to update this package, enter npm update animable-js --save in the terminal to run it.

```
npm install html-inline-webpack-plugin --save-dev
```

## And then In webpack.config.js
```cjs
// In webpack.config.js
const HTMLInlinePlugin = require("html-inline-webpack-plugin").default;

module.exports = {
  // Add an instance of HTMLInlinePlugin to plugins property value.
  plugins: [new HTMLInlinePlugin({...})]
}
```