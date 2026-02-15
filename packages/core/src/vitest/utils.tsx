import type { ReactElement, ReactNode } from "react";
import { expect } from "vitest";
import {
    render,
    waitFor,
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

async function customRender(
    ui: ReactElement,
    { theme, themeConfig, ...options }: CustomRenderOptions = {}
): Promise<RenderResult> {
    const result = render(ui, {
        wrapper: ({ children }) => (
            <ProviderWrapper theme={theme} themeConfig={themeConfig}>
                {children}
            </ProviderWrapper>
        ),
        ...options
    });
    // React 19 concurrent rendering: wait for DOM to be ready before returning
    // (Portal renders to body/target, so we also accept content elsewhere in document)
    await waitFor(
        () => {
            const hasContainerContent = result.container.firstChild != null;
            const hasPortalContent = document.querySelector("[data-testid]");
            expect(hasContainerContent || hasPortalContent).toBeTruthy();
        },
        { timeout: 3000 }
    );
    return result;
}

export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
export { customRender as render };
