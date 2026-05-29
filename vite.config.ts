import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["CHANGELOG.md", "pnpm-lock.yaml"],
  },
  lint: {
    categories: {
      correctness: "error",
      nursery: "error",
      perf: "error",
    },
    env: {
      node: true,
    },
    jsPlugins: ["vite-plus/oxlint-plugin"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  pack: {
    attw: { profile: "esm-only" },
    clean: true,
    dts: {
      tsgo: true,
    },
    entry: ["./src/index.ts"],
    fixedExtension: true,
    format: "esm",
    fromVite: true,
    minify: "dce-only",
    nodeProtocol: true,
    outDir: "dist",
    publint: true,
    sourcemap: false,
    treeshake: true,
    unused: true,
  },
  test: {
    typecheck: {
      enabled: true,
    },
  },
});
