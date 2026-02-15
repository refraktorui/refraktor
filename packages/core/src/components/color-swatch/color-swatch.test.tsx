import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import ColorSwatch from "./color-swatch";

describe("@refraktor/core/ColorSwatch", () => {
    it("renders with provided color", async () => {
        await render(
            <ColorSwatch
                color="rgba(255, 0, 0, 0.5)"
                data-testid="swatch"
                classNames={{ color: "custom-color" }}
            />
        );

        const swatch = screen.getByTestId("swatch");
        const colorLayer = swatch.querySelector(".custom-color") as HTMLSpanElement;

        expect(colorLayer).toBeInTheDocument();
        expect(colorLayer).toHaveStyle({ background: "rgba(255, 0, 0, 0.5)" });
    });

    it("forwards ref correctly", async () => {
        const ref = createRef<HTMLDivElement>();

        await render(<ColorSwatch ref={ref} data-testid="swatch" />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <ColorSwatch
                className="custom-root"
                classNames={{
                    grid: "custom-grid",
                    color: "custom-color",
                    content: "custom-content"
                }}
            >
                A
            </ColorSwatch>
        );

        const root = container.firstElementChild as HTMLDivElement;
        const gridLayer = root.querySelector(".custom-grid") as HTMLSpanElement;
        const colorLayer = root.querySelector(".custom-color") as HTMLSpanElement;
        const contentLayer = root.querySelector(".custom-content") as HTMLSpanElement;

        expect(root).toHaveClass("custom-root");
        expect(gridLayer).toBeInTheDocument();
        expect(colorLayer).toBeInTheDocument();
        expect(contentLayer).toBeInTheDocument();
    });

    it("includes transparency grid class", async () => {
        await render(
            <ColorSwatch
                data-testid="swatch"
                classNames={{ grid: "custom-grid" }}
                color="rgba(0, 128, 255, 0.4)"
            />
        );

        const swatch = screen.getByTestId("swatch");
        const gridLayer = swatch.querySelector(".custom-grid") as HTMLSpanElement;

        expect(gridLayer).toHaveClass("refraktor-transparency-grid");
    });

    it("applies size and radius classes", async () => {
        await render(<ColorSwatch size="xl" radius="full" data-testid="swatch" />);

        const swatch = screen.getByTestId("swatch");

        expect(swatch.className).toContain("size-10");
        expect(swatch.className).toContain("rounded-[var(--refraktor-radius-full)]");
    });
});
