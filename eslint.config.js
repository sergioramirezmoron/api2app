import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      "demo-app/**",
      "node_modules/**",
      "generated-app/**",
      "tmp/**",
      ".tmp/**",
      "temp/**"
    ]
  },
  {
    files: ["src/**/*.ts", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["tests/**/*.js"],
    rules: {
      "no-console": "off"
    }
  }
];
