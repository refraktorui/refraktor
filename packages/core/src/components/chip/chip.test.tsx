import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import Chip from "./chip";

describe("@refraktor/core/Chip", () => {
    it("renders correctly", async () => {
        await render(<Chip>React</Chip>);

        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("forwards ref correctly", async () => {
        const ref = createRef<HTMLDivElement>();

        await render(<Chip ref={ref}>React</Chip>);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current?.tagName).toBe("DIV");
    });

    it("supports uncontrolled selected state when selectable", async () => {
        const user = userEvent.setup();

        await render(<Chip selectable>React</Chip>);

        const chip = screen.getByRole("button", { name: "React" });

        expect(chip).toHaveAttribute("aria-pressed", "false");

        await user.click(chip);

        expect(chip).toHaveAttribute("aria-pressed", "true");
    });

    it("supports controlled selected state", async () => {
        const user = userEvent.setup();

        function Demo() {
            const [selected, setSelected] = useState(false);

            return (
                <Chip selectable selected={selected} onSelectedChange={setSelected}>
                    React
                </Chip>
            );
        }

        await render(<Demo />);

        const chip = screen.getByRole("button", { name: "React" });

        await user.click(chip);

        expect(chip).toHaveAttribute("aria-pressed", "true");
    });

    it("handles keyboard toggling", async () => {
        const user = userEvent.setup();

        await render(<Chip selectable>Vue</Chip>);

        const chip = screen.getByRole("button", { name: "Vue" });
        chip.focus();

        await user.keyboard("{Space}");
        expect(chip).toHaveAttribute("aria-pressed", "true");

        await user.keyboard("{Enter}");
        expect(chip).toHaveAttribute("aria-pressed", "false");
    });

    it("calls onRemove and does not toggle selection", async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        await render(
            <Chip selectable removable onRemove={onRemove} defaultSelected>
                Svelte
            </Chip>
        );

        const chip = screen.getByRole("button", { name: "Svelte" });
        const removeButton = screen.getByRole("button", { name: "Remove chip" });

        expect(chip).toHaveAttribute("aria-pressed", "true");

        await user.click(removeButton);

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(chip).toHaveAttribute("aria-pressed", "false");
    });

    it("supports group selection", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <Chip.Group defaultValue={["react"]} onChange={onChange}>
                <Chip value="react">React</Chip>
                <Chip value="vue">Vue</Chip>
            </Chip.Group>
        );

        const reactChip = screen.getByRole("button", { name: "React" });
        const vueChip = screen.getByRole("button", { name: "Vue" });

        expect(reactChip).toHaveAttribute("aria-pressed", "true");
        expect(vueChip).toHaveAttribute("aria-pressed", "false");

        await user.click(vueChip);
        expect(onChange).toHaveBeenLastCalledWith(["react", "vue"]);

        await user.click(reactChip);
        expect(onChange).toHaveBeenLastCalledWith(["vue"]);
    });

    it("removes value from group with removable chip", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <Chip.Group defaultValue={["react"]} onChange={onChange}>
                <Chip value="react" removable>
                    React
                </Chip>
            </Chip.Group>
        );

        await user.click(screen.getByRole("button", { name: "Remove chip" }));

        expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("supports disabled state from group", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(
            <Chip.Group disabled onChange={onChange}>
                <Chip value="react">React</Chip>
            </Chip.Group>
        );

        const chip = screen.getByRole("button", { name: "React" });
        await user.click(chip);

        expect(chip).toHaveAttribute("aria-disabled", "true");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("supports hidden inputs from group name", async () => {
        const { container } = await render(
            <Chip.Group name="frameworks" defaultValue={["react", "vue"]}>
                <Chip value="react">React</Chip>
                <Chip value="vue">Vue</Chip>
            </Chip.Group>
        );

        const hiddenInputs = container.querySelectorAll(
            'input[type="hidden"][name="frameworks"]'
        );

        expect(hiddenInputs).toHaveLength(2);
        expect(
            Array.from(hiddenInputs).map(
                (item) => (item as HTMLInputElement).value
            )
        ).toEqual(["react", "vue"]);
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <Chip
                className="custom-root"
                classNames={{
                    label: "custom-label",
                    removeButton: "custom-remove-button",
                    removeIcon: "custom-remove-icon"
                }}
                removable
            >
                React
            </Chip>
        );

        const root = container.firstElementChild as HTMLDivElement;
        const label = screen.getByText("React");
        const removeButton = screen.getByRole("button", { name: "Remove chip" });
        const removeIcon = removeButton.querySelector("span");

        expect(root).toHaveClass("custom-root");
        expect(label).toHaveClass("custom-label");
        expect(removeButton).toHaveClass("custom-remove-button");
        expect(removeIcon).toHaveClass("custom-remove-icon");
    });
});
