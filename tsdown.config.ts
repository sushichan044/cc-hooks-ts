import { defineConfig } from "tsdown";

export default defineConfig({
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
});
