import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src"),
      "@/auth": path.resolve(__dirname, "./src/modules/auth"),
      "@/profile": path.resolve(__dirname, "./src/modules/profile"),
      "@/public": path.resolve(__dirname, "./src/modules/public"),
      "@/config": path.resolve(__dirname, "./src/modules/config"),
      "@/home": path.resolve(__dirname, "./src/modules/home"),
      "@/core": path.resolve(__dirname, "./src/modules/core"),
    },
  },
});
