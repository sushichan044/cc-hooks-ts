// @ts-check

import ts from "@virtual-live-lab/eslint-config/presets/ts";
import importAccess from "eslint-plugin-import-access/flat-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  ts,
  {
    files: ["**/*.ts"],
    plugins: {
      // @ts-expect-error type mismatch between ESLint and typescript-eslint
      "import-access": importAccess,
    },
    rules: {
      "import-access/jsdoc": "error",
    },
  },
  {
    rules: {
      "perfectionist/sort-exports": "off",
    },
  },
);
