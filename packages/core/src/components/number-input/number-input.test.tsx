import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import NumberInput from "./number-input";

describe("@refraktor/core/NumberInput", () => {
    it("supports input wrapper props", async () => {
        await render(
            <NumberInput
                label="Quantity"
                description="Enter desired amount"
                error="Quantity is required"
            />
        );

        const input = screen.getByLabelText("Quantity");

        expect(input).toHaveAttribute("type", "number");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByText("Enter desired amount")).toBeInTheDocument();
        expect(screen.getByText("Quantity is required")).toBeInTheDocument();
    });
});
