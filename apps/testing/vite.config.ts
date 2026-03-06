import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "./",
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
            react: path.resolve(__dirname, "../../node_modules/react"),
            "react-dom": path.resolve(
                __dirname,
                "../../node_modules/react-dom"
            ),
            "@refraktor/core": path.resolve(
                __dirname,
                "../../packages/core/src/index.ts"
            ),
            "@refraktor/dates": path.resolve(
                __dirname,
                "../../packages/dates/src/index.ts"
            ),
            "@refraktor/utils": path.resolve(
                __dirname,
                "../../packages/utils/src/index.ts"
            )
        }
    }
});
