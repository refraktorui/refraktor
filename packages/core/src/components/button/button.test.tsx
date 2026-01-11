import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../vitest";
import Button from "./button";
import { createRef } from "react";

describe("@refraktor/core/Button", () => {
    it("should render correctly", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
        const ref = createRef<HTMLButtonElement>();

        render(<Button ref={ref}>Click me</Button>);

        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current?.tagName).toBe("BUTTON");
        expect(ref.current?.textContent).toBe("Click me");
    });

    it("handles click event correctly", () => {
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Click me</Button>);
        screen.getByText("Click me").click();
        expect(handleClick).toHaveBeenCalled();
    });

    it("disables button when disabled prop is true", () => {
        render(<Button disabled>Click me</Button>);

        const button = screen.getByRole("button", { name: "Click me" });

        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-disabled", "true");
        expect(button).toHaveAttribute("data-disabled", "true");
    });

    it("renders left section correctly", () => {
        render(
            <Button leftSection={<span data-testid="left-section">🚀</span>}>
                Click me
            </Button>
        );
        expect(screen.getByTestId("left-section")).toBeInTheDocument();
    });

    it("renders right section correctly", () => {
        render(
            <Button rightSection={<span data-testid="right-section">🚀</span>}>
                Click me
            </Button>
        );
        expect(screen.getByTestId("right-section")).toBeInTheDocument();
    });
});
