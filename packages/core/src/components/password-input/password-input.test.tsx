import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import PasswordInput from "./password-input";

describe("@refraktor/core/PasswordInput", () => {
    it("supports input wrapper props", async () => {
        await render(
            <PasswordInput
                label="Password"
                description="Use at least 8 characters"
                error="Password is required"
            />
        );

        const input = screen.getByLabelText("Password");

        expect(input).toHaveAttribute("type", "password");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByText("Use at least 8 characters")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();

        await render(<PasswordInput label="Password" />);

        const input = screen.getByLabelText("Password");
        const showButton = screen.getByRole("button", {
            name: "Show password"
        });

        expect(input).toHaveAttribute("type", "password");
        await user.click(showButton);
        expect(input).toHaveAttribute("type", "text");

        const hideButton = screen.getByRole("button", {
            name: "Hide password"
        });

        await user.click(hideButton);
        expect(input).toHaveAttribute("type", "password");
    });

    it("respects disabled state", async () => {
        const user = userEvent.setup();

        await render(<PasswordInput label="Password" disabled />);

        const input = screen.getByLabelText("Password");
        const toggle = screen.getByRole("button", {
            name: "Show password"
        });

        expect(toggle).toBeDisabled();
        await user.click(toggle);
        expect(input).toHaveAttribute("type", "password");
    });

    it("allows disabling visibility toggle", async () => {
        await render(
            <PasswordInput label="Password" withVisibilityToggle={false} />
        );

        const input = screen.getByLabelText("Password");

        expect(input).toHaveAttribute("type", "password");
        expect(
            screen.queryByRole("button", { name: "Show password" })
        ).not.toBeInTheDocument();
    });
});
