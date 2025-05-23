import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // root: "src", // Set the root to 'src'

  build: {
    target: "esnext",

    outDir: "dist", // Output directory (relative to the root)

    emptyOutDir: true, // Clean the output directory before building
  },
  resolve: { // définit un alias pour la racine
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
