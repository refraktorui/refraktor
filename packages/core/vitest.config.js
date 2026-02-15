/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

const actWarningRe =
    /An update to .* inside a test was not wrapped in act\(\.\.\.\)/;

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/vitest/setup.tsx"],
        exclude: ["node_modules", "build"],
        onConsoleLog(log, type) {
            if (type === "stderr" && actWarningRe.test(log)) return false;
        }
    }
});
