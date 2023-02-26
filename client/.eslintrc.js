module.exports = {
  root: true,
  env: {
    // this section will be used to determine which APIs are available to us
    // (i.e are we running in a browser environment or a node.js env)
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    requireConfigFile: false,
    sourceType: "module",
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  },
  ignorePatterns: ["*.d.ts"],
  plugins: [],
  extends: [
    // use the recommended rule set for both plain javascript and vue
    "eslint:recommended",
    "plugin:vue/recommended",
    "@vue/typescript",
  ],
  globals: {
    "module": "writable",
    "process": "writable",
  },
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "components" }],
    "require-atomic-updates": "off",
    "indent": ["warn", 2],
    "linebreak-style": ["warn", "windows"],
    "quotes": ["warn", "double"],
    "semi": ["warn", "always"],
    "spaced-comment": ["warn", "always", { "exceptions": ["-", "+"] }],
    "template-curly-spacing": ["off"],
    "vue/multi-word-component-names": "off"
  }
};