import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import tsParser from "@typescript-eslint/parser";
import nPlugin from "eslint-plugin-n";
import checkFile from "eslint-plugin-check-file";
import nextConfig from "eslint-config-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Spread Next.js Flat Config (do NOT wrap, do NOT call)
  ...nextConfig,

  {
    // ⛔ DO NOT re-add @typescript-eslint here — Next.js already adds it
    plugins: {
      n: nPlugin,
      "check-file": checkFile,
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },

    rules: {
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      semi: "error",
      quotes: ["error", "double"],
      "n/no-process-env": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/!(_*)": "KEBAB_CASE",
        },
      ],
    },
  },

  ...compat.config({
    extends: ["prettier"],
  }),
];
