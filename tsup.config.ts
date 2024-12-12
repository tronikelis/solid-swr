import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    target: "esnext",
    format: ["cjs", "esm"],
    entry: {
        extra: "./src/extra.ts",
        cache: "./src/cache.ts",
        index: "./src/index.ts",
    },
    dts: true,
});
