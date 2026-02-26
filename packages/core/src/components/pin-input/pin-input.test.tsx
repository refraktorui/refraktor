import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import PinInput from "./pin-input";

const getCells = (length: number) =>
    Array.from({ length }, (_, index) =>
        screen.getByLabelText(`Character ${index + 1} of ${length}`)
    ) as HTMLInputElement[];

describe("@refraktor/core/PinInput", () => {
    it("supports input wrapper props", async () => {
        await render(
            <PinInput
                label="Verification code"
                description="Enter the code from your authenticator app"
                error="Code is required"
            />
        );

        const firstCell = screen.getByLabelText("Verification code");

        expect(firstCell).toHaveAttribute("aria-invalid", "true");
        expect(
            screen.getByText("Enter the code from your authenticator app")
        ).toBeInTheDocument();
        expect(screen.getByText("Code is required")).toBeInTheDocument();
    });

    it("auto-advances focus and fires onComplete", async () => {
        const user = userEvent.setup();
        const onComplete = vi.fn();

        await render(<PinInput length={4} onComplete={onComplete} />);

        const cells = getCells(4);

        await user.type(cells[0], "1");
        expect(cells[1]).toHaveFocus();

        await user.type(cells[1], "2");
        await user.type(cells[2], "3");
        await user.type(cells[3], "4");

        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("handles backspace navigation", async () => {
        const user = userEvent.setup();

        await render(<PinInput length={4} />);

        const cells = getCells(4);

        await user.type(cells[0], "1");
        await user.type(cells[1], "2");
        expect(cells[2]).toHaveFocus();

        await user.keyboard("{Backspace}");

        expect(cells[1]).toHaveFocus();
        expect(cells[1]).toHaveValue("");
    });

    it("handles paste across cells", async () => {
        const user = userEvent.setup();

        await render(<PinInput length={6} characterSet="alphanumeric" />);

        const cells = getCells(6);

        cells[0].focus();
        await user.paste("A1B2C3");

        expect(cells.map((cell) => cell.value)).toEqual([
            "A",
            "1",
            "B",
            "2",
            "C",
            "3"
        ]);
    });

    it("supports alphanumeric and custom filtering props", async () => {
        const user = userEvent.setup();

        await render(
            <PinInput
                length={4}
                characterPattern={/[A-F0-9]/}
                transform="uppercase"
            />
        );

        const cells = getCells(4);

        await user.type(cells[0], "a");
        await user.type(cells[1], "g");
        await user.type(cells[1], "9");

        expect(cells[0]).toHaveValue("A");
        expect(cells[1]).toHaveValue("9");
    });

    it("supports controlled usage", async () => {
        const user = userEvent.setup();

        function Demo() {
            const [value, setValue] = useState("");
            return <PinInput length={4} value={value} onChange={setValue} />;
        }

        await render(<Demo />);

        const cells = getCells(4);
        await user.type(cells[0], "1");
        await user.type(cells[1], "2");

        expect(cells[0]).toHaveValue("1");
        expect(cells[1]).toHaveValue("2");
    });

    it("supports masking and hidden form value", async () => {
        await render(
            <PinInput
                length={4}
                defaultValue="A1B2"
                characterSet="alphanumeric"
                mask
                name="otp"
            />
        );

        const cells = getCells(4);

        for (const cell of cells) {
            expect(cell).toHaveAttribute("type", "password");
        }

        const hidden = document.querySelector(
            'input[type="hidden"][name="otp"]'
        ) as HTMLInputElement | null;

        expect(hidden).not.toBeNull();
        expect(hidden?.value).toBe("A1B2");
    });
});
