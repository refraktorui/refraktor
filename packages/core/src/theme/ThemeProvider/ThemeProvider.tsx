import { storage } from "@refraktor/utils";
import { Theme } from "../types";
import { ThemeProviderProps } from "./types";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { ThemeContextProvider } from "./context";
import { defaultTheme, RefraktorTheme } from "../createTheme";
import { generateVariables } from "./generateVariables";

const STORAGE_KEY = "refraktor-theme";

const getInitialTheme = (
    defaultTheme: Theme,
    persistenceEnabled: boolean,
    storageKey: string
) => {
    if (!persistenceEnabled) return defaultTheme;

    const storageTheme = storage.get(storageKey, defaultTheme);
    if (storageTheme === "light" || storageTheme === "dark")
        return storageTheme;

    return defaultTheme;
};

export const ThemeProvider = ({
    children,
    theme = "dark",
    themeConfig,
    components,
    persistence = { enabled: false }
}: ThemeProviderProps) => {
    const rootRef = useRef<HTMLElement>(null);

    const persistenceEnabled = persistence.enabled ?? false;
    const storageKey = persistence.storageKey ?? STORAGE_KEY;

    const [currentTheme, setCurrentTheme] = useState(() =>
        getInitialTheme(theme, persistenceEnabled, storageKey)
    );
    const [currentThemeConfig, setCurrentThemeConfig] =
        useState<RefraktorTheme>(() => themeConfig ?? defaultTheme);

    const themeVariables = useMemo(
        () => generateVariables(currentTheme, currentThemeConfig),
        [currentTheme, currentThemeConfig]
    );

    useEffect(() => {
        if (persistenceEnabled) storage.set(storageKey, currentTheme);
    }, [currentTheme, persistenceEnabled, storageKey]);

    const toggleTheme = useCallback(() => {
        setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setCurrentTheme(newTheme);
    }, []);

    useLayoutEffect(() => {
        if (typeof document !== "undefined") {
            rootRef.current = document.documentElement;
        }
    }, []);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        root.setAttribute("data-refraktor-theme", currentTheme);

        Object.entries(themeVariables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [themeVariables]);

    const contextValue = useMemo(
        () => ({
            theme: currentTheme,
            setTheme,
            toggleTheme,
            persistenceEnabled,
            themeConfig: currentThemeConfig,
            components: components ?? {}
        }),
        [
            currentTheme,
            setTheme,
            toggleTheme,
            persistenceEnabled,
            currentThemeConfig,
            components
        ]
    );

    return (
        <ThemeContextProvider value={contextValue}>
            {children}
        </ThemeContextProvider>
    );
};

ThemeProvider.displayName = "@refraktor/core/ThemeProvider";

export default ThemeProvider;
