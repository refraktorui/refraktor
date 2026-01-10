import { createSafeContext } from "@refraktor/utils";
import { ThemeProviderContextValue } from "./types";

export const [ThemeContextProvider, useThemeContext] =
    createSafeContext<ThemeProviderContextValue>(
        "[@refraktor/core] ThemeProvider was not found in the tree"
    );
