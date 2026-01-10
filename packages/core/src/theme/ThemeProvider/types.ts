import { ReactNode } from "react";
import { Theme } from "../types";
import { RefraktorTheme, ComponentsConfig } from "../createTheme";

export type ThemePersistenceOptions = {
    /** Whether to persist the theme in localStorage @default `true` */
    enabled?: boolean;

    /** Key to use for the localStorage item @default `refraktor-theme` */
    storageKey?: string;
};

export type ThemeProviderProps = {
    /** The children to render. */
    children: ReactNode;

    /** Theme to use by default @default `dark` */
    theme?: Theme;

    /** Theme configuration @default `defaultTheme` */
    themeConfig?: RefraktorTheme;

    /** Components configuration */
    components?: ComponentsConfig;

    /** Options for persisting the theme in localStorage */
    persistence?: ThemePersistenceOptions;
};

export type ThemeProviderContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    persistenceEnabled: boolean;
    themeConfig: RefraktorTheme;
    components: ComponentsConfig;
};
