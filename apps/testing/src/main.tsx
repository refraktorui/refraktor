import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "./index.css";
import { createTheme, ThemeProvider } from "@refraktor/core";
import { DatesProvider } from "@refraktor/dates";

const newTheme = createTheme({
    defaults: {
        radius: "md"
    }
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider themeConfig={newTheme}>
            <DatesProvider>
                <App />
            </DatesProvider>
        </ThemeProvider>
    </StrictMode>
);
