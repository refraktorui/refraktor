import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "./",
    optimizeDeps: {
        include: ["@refraktor/core", "react", "react-dom"]
    },
    build: {
        outDir: "build"
    },
    server: {
        port: 3000
    },
    resolve: {
        dedupe: ["react", "react-dom"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@repo/core": path.resolve(
                __dirname,
                "../../packages/core/src/index.ts"
            ),
            "@repo/utils": path.resolve(
                __dirname,
                "../../packages/utils/src/index.ts"
            )
        }
    }
});
