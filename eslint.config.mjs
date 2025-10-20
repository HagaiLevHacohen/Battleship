import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // For your browser source files
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
  },

  // Override for Node.js files like webpack config
  {
    files: ["webpack.config.js", "webpack.*.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  // Override for babel.config.js
  {
    files: ["babel.config.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  // ✅ Override for Jest test files
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);