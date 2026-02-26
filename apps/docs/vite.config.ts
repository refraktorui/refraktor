import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [tanstackRouter({ target: "react" }), react(), tailwindcss()],
    base: "./",
    build: {
        outDir: "build"
    },
    server: {
        port: 4000
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
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
