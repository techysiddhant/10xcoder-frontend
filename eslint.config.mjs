import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config(
    {
      "extends": ["next/core-web-vitals", "next/typescript", "prettier"],
      "plugins": ["check-file", "n"],
      "rules": {
        "prefer-arrow-callback": ["error"],
        "prefer-template": ["error"],
        "semi": ["error"],
        "quotes": ["error", "double"],
        "n/no-process-env": ["error"],
        "react/no-unescaped-entities": ["error"],
        "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
        "check-file/filename-naming-convention": [
          "error",
          {
            "**/*.{ts,tsx}": "KEBAB_CASE"
          },
          {
            "ignoreMiddleExtensions": true
          }
        ],
        "check-file/folder-naming-convention": [
          "error",
          {
            "src/**/!(_*)": "KEBAB_CASE" // Enforce kebab-case for folders except those starting with an underscore
          }
        ]
      }
    }
  ),
];

export default eslintConfig;
