import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import SegmentedControl from "./segmented-control";

const data = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" }
];

describe("@refraktor/core/SegmentedControl", () => {
    it("renders options and selected value", async () => {
        await render(<SegmentedControl data={data} defaultValue="react" />);

        expect(screen.getByRole("radiogroup")).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: "React" })).toHaveAttribute(
            "aria-checked",
            "true"
        );
        expect(screen.getByRole("radio", { name: "Vue" })).toHaveAttribute(
            "aria-checked",
            "false"
        );
    });

    it("forwards ref correctly", async () => {
        const ref = createRef<HTMLDivElement>();

        await render(<SegmentedControl ref={ref} data={data} />);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
    });

    it("handles click change events", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <SegmentedControl
                data={data}
                defaultValue="react"
                onChange={onChange}
            />
        );

        await user.click(screen.getByRole("radio", { name: "Vue" }));

        expect(onChange).toHaveBeenCalledWith("vue");
        expect(screen.getByRole("radio", { name: "Vue" })).toHaveAttribute(
            "aria-checked",
            "true"
        );
    });

    it("supports controlled mode", async () => {
        const user = userEvent.setup();

        function Demo() {
            const [value, setValue] = useState("react");

            return (
                <SegmentedControl
                    data={data}
                    value={value}
                    onChange={setValue}
                />
            );
        }

        await render(<Demo />);

        await user.click(screen.getByRole("radio", { name: "Svelte" }));

        expect(screen.getByRole("radio", { name: "Svelte" })).toHaveAttribute(
            "aria-checked",
            "true"
        );
    });

    it("does not select disabled item", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <SegmentedControl
                defaultValue="react"
                onChange={onChange}
                data={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue", disabled: true }
                ]}
            />
        );

        const disabledControl = screen.getByRole("radio", { name: "Vue" });

        expect(disabledControl).toBeDisabled();

        await user.click(disabledControl);

        expect(onChange).not.toHaveBeenCalled();
        expect(disabledControl).toHaveAttribute("aria-checked", "false");
    });

    it("supports keyboard navigation and skips disabled items", async () => {
        const user = userEvent.setup();

        await render(
            <SegmentedControl
                defaultValue="react"
                data={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue", disabled: true },
                    { value: "svelte", label: "Svelte" }
                ]}
            />
        );

        const reactControl = screen.getByRole("radio", { name: "React" });
        reactControl.focus();

        await user.keyboard("{ArrowRight}");

        const svelteControl = screen.getByRole("radio", { name: "Svelte" });

        expect(svelteControl).toHaveFocus();
        expect(svelteControl).toHaveAttribute("aria-checked", "true");
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <SegmentedControl
                data={data}
                className="custom-root"
                classNames={{
                    control: "custom-control",
                    label: "custom-label"
                }}
            />
        );

        const root = container.firstElementChild as HTMLDivElement;
        const control = screen.getByRole("radio", { name: "React" });
        const label = screen.getByText("React");

        expect(root).toHaveClass("custom-root");
        expect(control).toHaveClass("custom-control");
        expect(label).toHaveClass("custom-label");
    });
});
