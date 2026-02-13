import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import Radio from "./radio";

describe("@refraktor/core/Radio", () => {
    it("renders correctly", () => {
        render(<Radio label="React" />);

        expect(
            screen.getByRole("radio", { name: "React" })
        ).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
        const ref = createRef<HTMLInputElement>();

        render(<Radio ref={ref} label="React" />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current?.tagName).toBe("INPUT");
        expect(ref.current?.type).toBe("radio");
    });

    it("handles change events", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Radio label="React" onChange={onChange} />);

        const input = screen.getByRole("radio", { name: "React" });
        await user.click(input);

        expect(input).toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("supports radio group", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Radio.Group defaultValue="react" onChange={onChange}>
                <Radio value="react" label="React" />
                <Radio value="vue" label="Vue" />
            </Radio.Group>
        );

        const reactInput = screen.getByRole("radio", { name: "React" });
        const vueInput = screen.getByRole("radio", { name: "Vue" });

        expect(reactInput).toBeChecked();
        expect(vueInput).not.toBeChecked();

        await user.click(vueInput);
        expect(onChange).toHaveBeenLastCalledWith("vue");
        expect(vueInput).toBeChecked();
        expect(reactInput).not.toBeChecked();

        await user.click(reactInput);
        expect(onChange).toHaveBeenLastCalledWith("react");
        expect(reactInput).toBeChecked();
        expect(vueInput).not.toBeChecked();
    });

    it("propagates disabled state from group", () => {
        render(
            <Radio.Group disabled>
                <Radio value="react" label="React" />
            </Radio.Group>
        );

        expect(screen.getByRole("radio", { name: "React" })).toBeDisabled();
    });
});
