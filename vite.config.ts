import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    preact(),
    dts({
      outDir: "dist/types",
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"), // Prevents "process is not defined" error
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "SuprSend",
      fileName: (format) => `bundle.${format}.js`,
    },
  },
});
