
// @ts-check
/// <reference types="@prettier/plugin-pug/src/prettier" />

/**
 * @type {import('prettier').Options}
 */

module.exports = {
  plugins: [require.resolve('@prettier/plugin-pug')],  
  pugBracketSameLine: false,
  pugSingleQuote: false,
  pugWrapAttributesThreshold: 1,
  pugUseTabs: false,
  "spaceBeforeFunctionParen": false,
  "arrowParens": "always",
  "pugBracketSpacing": false,
  "pugIndentOffset": -2,
  "pugIndentStart": false,
  "semi": false,
  "pugPrintWidth": 80,
  "pugSingleFileComponentIndentation": true,
  "pugAttributeSeparator": "none",
  "pugSortAttributes": "asc",
  "pugClosingBracketPosition": "new-line",
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 80,
  }
