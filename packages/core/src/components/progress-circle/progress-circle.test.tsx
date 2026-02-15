import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../../vitest";
import ProgressCircle from "./progress-circle";

function getCircleMetrics(bar: SVGCircleElement) {
    const radius = Number(bar.getAttribute("r"));
    const circumference = 2 * Math.PI * radius;
    return { radius, circumference };
}

describe("@refraktor/core/ProgressCircle", () => {
    it("renders with determinate values", async () => {
        await render(<ProgressCircle value={45} aria-label="Upload progress" />);

        const root = screen.getByRole("progressbar", {
            name: "Upload progress"
        });
        const circles = root.querySelectorAll("circle");
        const bar = circles[1] as SVGCircleElement;

        expect(root).toHaveAttribute("aria-valuemin", "0");
        expect(root).toHaveAttribute("aria-valuemax", "100");
        expect(root).toHaveAttribute("aria-valuenow", "45");

        const { circumference } = getCircleMetrics(bar);
        const expectedOffset = circumference - (45 / 100) * circumference;
        expect(
            Number(bar.getAttribute("stroke-dashoffset"))
        ).toBeCloseTo(expectedOffset, 4);
    });

    it("forwards ref correctly", async () => {
        const ref = createRef<HTMLDivElement>();

        await render(<ProgressCircle ref={ref} aria-label="Progress" />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
        expect(ref.current).toHaveAttribute("role", "progressbar");
    });

    it("clamps values outside range", async () => {
        const { rerender } = await render(
            <ProgressCircle value={-20} aria-label="Clamped progress" />
        );

        let root = screen.getByRole("progressbar", { name: "Clamped progress" });
        let circles = root.querySelectorAll("circle");
        let bar = circles[1] as SVGCircleElement;

        expect(root).toHaveAttribute("aria-valuenow", "0");

        let { circumference } = getCircleMetrics(bar);
        expect(
            Number(bar.getAttribute("stroke-dashoffset"))
        ).toBeCloseTo(circumference, 4);

        rerender(<ProgressCircle value={180} aria-label="Clamped progress" />);

        await waitFor(() => {
            root = screen.getByRole("progressbar", { name: "Clamped progress" });
            circles = root.querySelectorAll("circle");
            bar = circles[1] as SVGCircleElement;
            expect(root).toHaveAttribute("aria-valuenow", "100");
            ({ circumference } = getCircleMetrics(bar));
            expect(
                Number(bar.getAttribute("stroke-dashoffset"))
            ).toBeCloseTo(0, 4);
        });
    });

    it("supports custom min and max", async () => {
        await render(
            <ProgressCircle
                value={25}
                min={20}
                max={40}
                aria-label="Custom range progress"
            />
        );

        const root = screen.getByRole("progressbar", {
            name: "Custom range progress"
        });
        const circles = root.querySelectorAll("circle");
        const bar = circles[1] as SVGCircleElement;

        expect(root).toHaveAttribute("aria-valuemin", "20");
        expect(root).toHaveAttribute("aria-valuemax", "40");
        expect(root).toHaveAttribute("aria-valuenow", "25");

        const { circumference } = getCircleMetrics(bar);
        const expectedOffset = circumference - (25 / 100) * circumference;
        expect(
            Number(bar.getAttribute("stroke-dashoffset"))
        ).toBeCloseTo(expectedOffset, 4);
    });

    it("supports indeterminate mode", async () => {
        await render(<ProgressCircle indeterminate aria-label="Loading progress" />);

        const root = screen.getByRole("progressbar", {
            name: "Loading progress"
        });
        const circles = root.querySelectorAll("circle");
        const bar = circles[1] as SVGCircleElement;

        expect(root).not.toHaveAttribute("aria-valuemin");
        expect(root).not.toHaveAttribute("aria-valuemax");
        expect(root).not.toHaveAttribute("aria-valuenow");
        expect(bar).toHaveClass("loader-spin");
        expect(bar.getAttribute("stroke-dasharray")).not.toBe("");
    });

    it("supports root and slot class names", async () => {
        await render(
            <ProgressCircle
                aria-label="Styled progress"
                className="custom-root"
                classNames={{
                    svg: "custom-svg",
                    track: "custom-track",
                    bar: "custom-bar"
                }}
            />
        );

        const root = screen.getByRole("progressbar", { name: "Styled progress" });
        const svg = root.querySelector("svg") as SVGSVGElement;
        const circles = root.querySelectorAll("circle");
        const track = circles[0] as SVGCircleElement;
        const bar = circles[1] as SVGCircleElement;

        expect(root).toHaveClass("custom-root");
        expect(svg).toHaveClass("custom-svg");
        expect(track).toHaveClass("custom-track");
        expect(bar).toHaveClass("custom-bar");
    });
});
