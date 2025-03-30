import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});
