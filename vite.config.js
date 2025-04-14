import { defineConfig } from "vite";
import path, { resolve } from "path";

export default defineConfig({
  root: "./src",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // pour utiliser @/
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        homePage: resolve(__dirname, "src/pages/home/home.html"),
        galleryPage: resolve(__dirname, "src/pages/projects/projects.html"),
        aboutPage: resolve(__dirname, "src/pages/settings/settings.html"),
        contactPage: resolve(__dirname, "src/pages/help/help.html"),
      },
    },
  },
});
