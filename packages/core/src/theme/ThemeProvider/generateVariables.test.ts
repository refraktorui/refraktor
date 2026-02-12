import { describe, expect, it } from "vitest";
import { createTheme } from "../createTheme";
import { generateVariables } from "./generateVariables";

describe("generateVariables", () => {
    it("uses dark text on light primary colors when autoContrast is enabled", () => {
        const themeConfig = createTheme({
            defaults: {
                primaryColor: "cloud",
                primaryShade: 5,
                autoContrast: true
            }
        });

        const variables = generateVariables("light", themeConfig);

        expect(variables["--refraktor-primary"]).toBe("#dbe2ea");
        expect(variables["--refraktor-primary-text"]).toBe("#000000");
    });

    it("keeps shade-based text color when autoContrast is disabled", () => {
        const themeConfig = createTheme({
            defaults: {
                primaryColor: "cloud",
                primaryShade: 5,
                autoContrast: false
            }
        });

        const variables = generateVariables("light", themeConfig);

        expect(variables["--refraktor-primary-text"]).toBe("#ffffff");
    });

    it("supports custom hex primary colors and chooses readable text", () => {
        const themeConfig = createTheme({
            defaults: {
                primaryColor: "#f8fafc",
                autoContrast: true
            }
        });

        const variables = generateVariables("light", themeConfig);

        expect(variables["--refraktor-primary"]).toBe("#f8fafc");
        expect(variables["--refraktor-primary-hover"]).toBe("#f8fafc");
        expect(variables["--refraktor-primary-text"]).toBe("#000000");
    });
});
