import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Textarea from "./textarea";

describe("@refraktor/core/Textarea", () => {
    it("supports input wrapper props", async () => {
        await render(
            <Textarea
                label="Summary"
                description="Share an update"
                error="Summary is required"
            />
        );

        const textarea = screen.getByLabelText("Summary");

        expect(textarea).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByText("Share an update")).toBeInTheDocument();
        expect(screen.getByText("Summary is required")).toBeInTheDocument();
    });

    it("renders left and right sections", async () => {
        await render(
            <Textarea
                label="Notes"
                leftSection={<span data-testid="left-section">L</span>}
                rightSection={<span data-testid="right-section">R</span>}
            />
        );

        expect(screen.getByTestId("left-section")).toBeInTheDocument();
        expect(screen.getByTestId("right-section")).toBeInTheDocument();
    });

    it("supports sections on Textarea.Field with autosize", async () => {
        await render(
            <Textarea.Field
                autosize
                leftSection={<span data-testid="field-left-section">L</span>}
                rightSection={<span data-testid="field-right-section">R</span>}
            />
        );

        expect(screen.getByTestId("field-left-section")).toBeInTheDocument();
        expect(screen.getByTestId("field-right-section")).toBeInTheDocument();
    });
});
