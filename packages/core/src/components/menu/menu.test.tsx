import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Menu from "./menu";

describe("@refraktor/core/Menu", () => {
    const transitionProps = {
        duration: 0,
        immediate: true
    } as const;

    it("opens on trigger click and closes on item selection", async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        await render(
            <Menu transitionProps={transitionProps}>
                <Menu.Trigger>
                    <button type="button">Open menu</button>
                </Menu.Trigger>

                <Menu.Dropdown>
                    <Menu.Item onSelect={onSelect}>Profile</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );

        await user.click(screen.getByRole("button", { name: "Open menu" }));
        expect(screen.getByRole("menu")).toBeInTheDocument();

        await user.click(screen.getByRole("menuitem", { name: "Profile" }));

        expect(onSelect).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        });
    });

    it("does not activate disabled item", async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        await render(
            <Menu transitionProps={transitionProps}>
                <Menu.Trigger>
                    <button type="button">Open menu</button>
                </Menu.Trigger>

                <Menu.Dropdown>
                    <Menu.Item disabled onSelect={onSelect}>
                        Disabled item
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );

        await user.click(screen.getByRole("button", { name: "Open menu" }));

        const item = screen.getByRole("menuitem", { name: "Disabled item" });
        expect(item).toBeDisabled();

        await user.click(item);
        expect(onSelect).not.toHaveBeenCalled();
        expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
        const user = userEvent.setup();
        const onFirstSelect = vi.fn();
        const onSecondSelect = vi.fn();

        await render(
            <Menu transitionProps={transitionProps}>
                <Menu.Trigger>
                    <button type="button">Open menu</button>
                </Menu.Trigger>

                <Menu.Dropdown>
                    <Menu.Item onSelect={onFirstSelect}>First</Menu.Item>
                    <Menu.Item onSelect={onSecondSelect}>Second</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );

        const trigger = screen.getByRole("button", { name: "Open menu" });
        trigger.focus();

        await user.keyboard("{ArrowDown}");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Enter}");

        expect(onFirstSelect).not.toHaveBeenCalled();
        expect(onSecondSelect).toHaveBeenCalledTimes(1);
    });

    it("opens submenu with keyboard and selects submenu item", async () => {
        const user = userEvent.setup();
        const onSubSelect = vi.fn();

        await render(
            <Menu transitionProps={transitionProps}>
                <Menu.Trigger>
                    <button type="button">Open menu</button>
                </Menu.Trigger>

                <Menu.Dropdown>
                    <Menu.Sub>
                        <Menu.SubTrigger>More</Menu.SubTrigger>

                        <Menu.SubDropdown>
                            <Menu.Item onSelect={onSubSelect}>Sub item</Menu.Item>
                        </Menu.SubDropdown>
                    </Menu.Sub>
                </Menu.Dropdown>
            </Menu>
        );

        await user.click(screen.getByRole("button", { name: "Open menu" }));

        const subTrigger = screen.getByRole("menuitem", { name: "More" });
        subTrigger.focus();

        await user.keyboard("{ArrowRight}");

        const subItem = await screen.findByRole("menuitem", {
            name: "Sub item"
        });

        await user.click(subItem);
        expect(onSubSelect).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.queryAllByRole("menu")).toHaveLength(0);
        });
    });
});
