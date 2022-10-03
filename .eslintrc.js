module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    'cypress/globals': true
  },
  extends: ['plugin:vue/essential', '@vue/standard', 'plugin:storybook/recommended'],
  // required to lint *.vue files
  plugins: ['vue', 'cypress'],
  globals: {
    ga: true,
    // Google Analytics
    cordova: true,
    __statics: true,
    process: true
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  ignorePatterns: [
    "generated-stories-entry.js",
    "storybook-init-framework-entry.js"
  ],
};