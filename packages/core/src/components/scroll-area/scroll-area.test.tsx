import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import ScrollArea from "./scroll-area";

describe("@refraktor/core/ScrollArea", () => {
    it("renders children with default vertical scroll behavior", async () => {
        await render(
            <ScrollArea data-testid="scroll-area">
                <div>Content</div>
            </ScrollArea>
        );

        const scrollArea = screen.getByTestId("scroll-area");

        expect(scrollArea).toHaveClass("refraktor-scrollbar");
        expect(scrollArea).toHaveClass("overflow-y-auto");
        expect(scrollArea).toHaveClass("overflow-x-hidden");
        expect(scrollArea).toHaveTextContent("Content");
    });

    it("supports horizontal and bidirectional orientation", async () => {
        const { rerender } = await render(
            <ScrollArea data-testid="scroll-area" orientation="horizontal" />
        );

        expect(screen.getByTestId("scroll-area")).toHaveClass(
            "overflow-x-auto"
        );
        expect(screen.getByTestId("scroll-area")).toHaveClass(
            "overflow-y-hidden"
        );

        rerender(<ScrollArea data-testid="scroll-area" orientation="both" />);

        expect(screen.getByTestId("scroll-area")).toHaveClass("overflow-auto");
    });

    it("applies scrollbar size css variable", async () => {
        await render(<ScrollArea data-testid="scroll-area" scrollbarSize={10} />);

        const scrollArea = screen.getByTestId("scroll-area");

        expect(scrollArea.style.getPropertyValue("--refraktor-scrollbar-size")).toBe(
            "10px"
        );
    });

    it("supports root and slot class names", async () => {
        await render(
            <ScrollArea
                data-testid="scroll-area"
                className="custom-root"
                classNames={{ root: "slot-root" }}
            />
        );

        const scrollArea = screen.getByTestId("scroll-area");

        expect(scrollArea).toHaveClass("custom-root");
        expect(scrollArea).toHaveClass("slot-root");
    });

    it("forwards ref to root element", async () => {
        const ref = createRef<HTMLDivElement>();

        await render(<ScrollArea ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
    });
});
