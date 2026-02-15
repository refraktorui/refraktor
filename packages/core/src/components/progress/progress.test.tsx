import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Progress from "./progress";

describe("@refraktor/core/Progress", () => {
    it("renders with determinate values", () => {
        render(<Progress value={45} aria-label="Upload progress" />);

        const track = screen.getByRole("progressbar", {
            name: "Upload progress"
        });
        const bar = track.firstElementChild as HTMLDivElement;

        expect(track).toHaveAttribute("aria-valuemin", "0");
        expect(track).toHaveAttribute("aria-valuemax", "100");
        expect(track).toHaveAttribute("aria-valuenow", "45");
        expect(bar).toHaveStyle({ width: "45%" });
    });

    it("forwards ref correctly", () => {
        const ref = createRef<HTMLDivElement>();

        render(<Progress ref={ref} aria-label="Progress" />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
        expect(ref.current).toHaveAttribute("role", "progressbar");
    });

    it("clamps values outside range", () => {
        const { rerender } = render(
            <Progress value={-20} aria-label="Clamped progress" />
        );

        let track = screen.getByRole("progressbar", { name: "Clamped progress" });
        let bar = track.firstElementChild as HTMLDivElement;
        expect(track).toHaveAttribute("aria-valuenow", "0");
        expect(bar).toHaveStyle({ width: "0%" });

        rerender(<Progress value={180} aria-label="Clamped progress" />);

        track = screen.getByRole("progressbar", { name: "Clamped progress" });
        bar = track.firstElementChild as HTMLDivElement;
        expect(track).toHaveAttribute("aria-valuenow", "100");
        expect(bar).toHaveStyle({ width: "100%" });
    });

    it("supports custom min and max", () => {
        render(
            <Progress
                value={25}
                min={20}
                max={40}
                aria-label="Custom range progress"
            />
        );

        const track = screen.getByRole("progressbar", {
            name: "Custom range progress"
        });
        const bar = track.firstElementChild as HTMLDivElement;

        expect(track).toHaveAttribute("aria-valuemin", "20");
        expect(track).toHaveAttribute("aria-valuemax", "40");
        expect(track).toHaveAttribute("aria-valuenow", "25");
        expect(bar).toHaveStyle({ width: "25%" });
    });

    it("supports indeterminate mode", () => {
        render(<Progress indeterminate aria-label="Loading progress" />);

        const track = screen.getByRole("progressbar", {
            name: "Loading progress"
        });
        const bar = track.firstElementChild as HTMLDivElement;

        expect(track).not.toHaveAttribute("aria-valuemin");
        expect(track).not.toHaveAttribute("aria-valuemax");
        expect(track).not.toHaveAttribute("aria-valuenow");
        expect(bar).toHaveClass("refraktor-progress-indeterminate");
        expect(bar.style.width).toBe("");
    });

    it("supports root and slot class names", () => {
        const { container } = render(
            <Progress
                aria-label="Styled progress"
                className="custom-root"
                classNames={{
                    track: "custom-track",
                    bar: "custom-bar"
                }}
            />
        );

        const root = container.firstElementChild as HTMLDivElement;
        const track = screen.getByRole("progressbar", { name: "Styled progress" });
        const bar = track.firstElementChild as HTMLDivElement;

        expect(root).toHaveClass("custom-root");
        expect(track).toHaveClass("custom-track");
        expect(bar).toHaveClass("custom-bar");
    });
});
