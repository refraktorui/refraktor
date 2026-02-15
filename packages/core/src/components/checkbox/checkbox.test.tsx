import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import Checkbox from "./checkbox";

describe("@refraktor/core/Checkbox", () => {
    it("renders correctly", async () => {
        await render(<Checkbox label="Accept terms" />);

        expect(
            screen.getByRole("checkbox", { name: "Accept terms" })
        ).toBeInTheDocument();
    });

    it("forwards ref correctly", async () => {
        const ref = createRef<HTMLInputElement>();

        await render(<Checkbox ref={ref} label="Accept terms" />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current?.tagName).toBe("INPUT");
        expect(ref.current?.type).toBe("checkbox");
    });

    it("handles change events", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(<Checkbox label="Accept terms" onChange={onChange} />);

        const input = screen.getByRole("checkbox", { name: "Accept terms" });
        await user.click(input);

        expect(input).toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("supports indeterminate state", async () => {
        await render(<Checkbox label="Select all" indeterminate />);

        const input = screen.getByRole("checkbox", { name: "Select all" });

        expect(input).toHaveAttribute("aria-checked", "mixed");
        expect((input as HTMLInputElement).indeterminate).toBe(true);
    });

    it("supports checkbox group", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <Checkbox.Group defaultValue={["react"]} onChange={onChange}>
                <Checkbox value="react" label="React" />
                <Checkbox value="vue" label="Vue" />
            </Checkbox.Group>
        );

        const reactInput = screen.getByRole("checkbox", { name: "React" });
        const vueInput = screen.getByRole("checkbox", { name: "Vue" });

        expect(reactInput).toBeChecked();
        expect(vueInput).not.toBeChecked();

        await user.click(vueInput);
        expect(onChange).toHaveBeenLastCalledWith(["react", "vue"]);

        await user.click(reactInput);
        expect(onChange).toHaveBeenLastCalledWith(["vue"]);
    });

    it("propagates disabled state from group", async () => {
        await render(
            <Checkbox.Group disabled>
                <Checkbox value="react" label="React" />
            </Checkbox.Group>
        );

        expect(screen.getByRole("checkbox", { name: "React" })).toBeDisabled();
    });
});
