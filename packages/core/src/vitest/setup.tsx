import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Fix for Vitest + React 18/19: ensure IS_REACT_ACT_ENVIRONMENT is set on globalThis
// (Vitest's jsdom has self !== globalThis, so RTL's flag isn't visible to React)
let _actEnv = true;
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
    get() {
        return _actEnv;
    },
    set(value: boolean) {
        _actEnv = value;
    },
    configurable: true
});

afterEach(() => {
    cleanup();
});
