import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import Tabs from "./tabs";

describe("@refraktor/core/Tabs", () => {
    it("renders default active tab and panel", async () => {
        await render(
            <Tabs defaultValue="account">
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account">Account panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>
        );

        expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
            "aria-selected",
            "true"
        );
        expect(screen.getByText("Account panel")).toBeInTheDocument();
        expect(screen.queryByText("Security panel")).not.toBeInTheDocument();
    });

    it("supports controlled mode", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        function Demo() {
            const [value, setValue] = useState("account");

            return (
                <Tabs
                    value={value}
                    onChange={(nextValue) => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab value="account">Account</Tabs.Tab>
                        <Tabs.Tab value="security">Security</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="account">Account panel</Tabs.Panel>
                    <Tabs.Panel value="security">Security panel</Tabs.Panel>
                </Tabs>
            );
        }

        await render(<Demo />);
        await user.click(screen.getByRole("tab", { name: "Security" }));

        expect(onChange).toHaveBeenCalledWith("security");
        expect(screen.getByText("Security panel")).toBeInTheDocument();
    });

    it("supports keyboard navigation with automatic activation", async () => {
        const user = userEvent.setup();

        await render(
            <Tabs defaultValue="account">
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account">Account panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
                <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
            </Tabs>
        );

        screen.getByRole("tab", { name: "Account" }).focus();
        await user.keyboard("{ArrowRight}");

        expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
            "aria-selected",
            "true"
        );
        expect(screen.getByText("Security panel")).toBeInTheDocument();
    });

    it("supports manual activation mode", async () => {
        const user = userEvent.setup();

        await render(
            <Tabs defaultValue="account" activationMode="manual">
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account">Account panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>
        );

        screen.getByRole("tab", { name: "Account" }).focus();
        await user.keyboard("{ArrowRight}");

        expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
            "aria-selected",
            "true"
        );
        expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus();

        await user.keyboard("{Enter}");

        expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
            "aria-selected",
            "true"
        );
        expect(screen.getByText("Security panel")).toBeInTheDocument();
    });

    it("keeps inactive panels mounted when keepMounted is true", async () => {
        await render(
            <Tabs defaultValue="account" keepMounted>
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account">Account panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>
        );

        const hiddenPanel = screen.getByText("Security panel");

        expect(hiddenPanel).toBeInTheDocument();
        expect(hiddenPanel).toHaveAttribute("hidden");
    });

    it("skips disabled tabs during keyboard navigation", async () => {
        const user = userEvent.setup();

        await render(
            <Tabs defaultValue="account">
                <Tabs.List>
                    <Tabs.Tab value="account">Account</Tabs.Tab>
                    <Tabs.Tab value="security" disabled>
                        Security
                    </Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="account">Account panel</Tabs.Panel>
                <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
            </Tabs>
        );

        screen.getByRole("tab", { name: "Account" }).focus();
        await user.keyboard("{ArrowRight}");

        expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute(
            "aria-selected",
            "true"
        );
        expect(screen.getByText("Billing panel")).toBeInTheDocument();
    });
});
