# 1.0.0-beta7
- Fixed an issue where favicon assets would not load if the files were in binary data formats.

# 1.0.0-beta8
- Changed the property name of an option from `favIcon` to `favicon`.
- Fixed an issue with the inject option where all script code was inserted inline into the document. This caused problems for code that needed to be executed after the entire tree was loaded, as the `DOMContentLoaded` event was used to wrap and trigger the code. This approach led to issues with scripts dependent on the `DOMContentLoaded` event, causing adverse effects and malfunctioning of the code. The issue has been resolved to ensure that scripts dependent on `DOMContentLoaded` function correctly without negative impacts.

# 1.0.0
- Added a new "Loaded" option to `HTMLInlineWebpackPluginScriptLoading`. And "ASYNC" option has been removed.