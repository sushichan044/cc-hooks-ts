import { defineConfig } from "tsdown";

export default defineConfig({
  attw: { profile: "esmOnly" },
  clean: true,
  dts: {
    resolve: [/claude-code/], // we cannot specify `@anthropic-ai/claude-code`. May be a bug?
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
