import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Select from "./select";

describe("@refraktor/core/Select", () => {
    const transitionProps = {
        duration: 0,
        immediate: true
    } as const;

    it("supports built-in data mode", async () => {
        const user = userEvent.setup();

        await render(
            <Select
                placeholder="Pick framework"
                transitionProps={transitionProps}
                data={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" }
                ]}
            />
        );

        const trigger = screen.getByRole("combobox");
        expect(trigger).toHaveAttribute("placeholder", "Pick framework");

        await user.click(trigger);
        await user.click(screen.getByRole("option", { name: "React" }));

        expect(trigger).toHaveValue("React");

        await waitFor(() => {
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });
    });

    it("renders searchable input inside dropdown", async () => {
        const user = userEvent.setup();

        await render(
            <Select
                searchable
                transitionProps={transitionProps}
                data={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" },
                    { value: "solid", label: "Solid" }
                ]}
            />
        );

        await user.click(screen.getByRole("combobox"));

        const searchInput = screen.getByPlaceholderText("Search...");
        expect(searchInput).toBeInTheDocument();

        await user.type(searchInput, "vu");

        expect(screen.getByRole("option", { name: "Vue" })).toBeInTheDocument();
        expect(
            screen.queryByRole("option", { name: "React" })
        ).not.toBeInTheDocument();

        await user.clear(searchInput);
        await user.type(searchInput, "unknown");

        expect(screen.getByText("No options")).toBeInTheDocument();
    });

    it("supports compound mode with groups", async () => {
        const user = userEvent.setup();

        await render(
            <Select.Root transitionProps={transitionProps}>
                <Select.Trigger />

                <Select.Dropdown>
                    <Select.Group label="Frontend">
                        <Select.Item value="react">React</Select.Item>
                    </Select.Group>

                    <Select.Group label="Backend">
                        <Select.Item value="node">Node.js</Select.Item>
                    </Select.Group>
                </Select.Dropdown>
            </Select.Root>
        );

        const trigger = screen.getByRole("combobox");

        await user.click(trigger);
        expect(screen.getByText("Frontend")).toBeInTheDocument();
        expect(screen.getByText("Backend")).toBeInTheDocument();

        await user.click(screen.getByRole("option", { name: "Node.js" }));
        expect(trigger).toHaveValue("Node.js");
    });

    it("supports keyboard selection", async () => {
        const user = userEvent.setup();

        await render(
            <Select
                transitionProps={transitionProps}
                data={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" }
                ]}
            />
        );

        const trigger = screen.getByRole("combobox");
        trigger.focus();

        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Enter}");

        expect(trigger).toHaveValue("Vue");
    });

    it("supports controlled mode", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        function Demo() {
            const [value, setValue] = useState<string | null>("react");

            return (
                <Select
                    value={value}
                    onChange={(nextValue) => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                    transitionProps={transitionProps}
                    data={[
                        { value: "react", label: "React" },
                        { value: "vue", label: "Vue" }
                    ]}
                />
            );
        }

        await render(<Demo />);

        await user.click(screen.getByRole("combobox"));
        await user.click(screen.getByRole("option", { name: "Vue" }));

        expect(onChange).toHaveBeenCalledWith("vue");
        expect(screen.getByRole("combobox")).toHaveValue("Vue");
    });
});
