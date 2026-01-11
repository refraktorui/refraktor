import type { ReactElement, ReactNode } from "react";
import {
    render,
    type RenderOptions,
    type RenderResult
} from "@testing-library/react";
import { ThemeProvider, type RefraktorTheme, type Theme } from "../theme";

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
    theme?: Theme;
    themeConfig?: RefraktorTheme;
};

function ProviderWrapper({
    children,
    theme = "dark",
    themeConfig
}: {
    children: ReactNode;
    theme?: Theme;
    themeConfig?: RefraktorTheme;
}) {
    return (
        <ThemeProvider theme={theme} themeConfig={themeConfig}>
            {children}
        </ThemeProvider>
    );
}

function customRender(
    ui: ReactElement,
    { theme, themeConfig, ...options }: CustomRenderOptions = {}
): RenderResult {
    return render(ui, {
        wrapper: ({ children }) => (
            <ProviderWrapper theme={theme} themeConfig={themeConfig}>
                {children}
            </ProviderWrapper>
        ),
        ...options
    });
}

export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
export { customRender as render };
