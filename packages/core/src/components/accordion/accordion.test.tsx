import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import Accordion from "./accordion";

describe("@refraktor/core/Accordion", () => {
    it("renders default opened item", async () => {
        await render(
            <Accordion defaultValue="account">
                <Accordion.Item value="account">
                    <Accordion.Control>Account</Accordion.Control>
                    <Accordion.Panel>Account panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="security">
                    <Accordion.Control>Security</Accordion.Control>
                    <Accordion.Panel>Security panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        );

        expect(
            screen.getByRole("button", { name: "Account" })
        ).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Account panel")).toBeInTheDocument();
        expect(screen.queryByText("Security panel")).not.toBeInTheDocument();
    });

    it("toggles items in single mode", async () => {
        const user = userEvent.setup();

        await render(
            <Accordion defaultValue="account">
                <Accordion.Item value="account">
                    <Accordion.Control>Account</Accordion.Control>
                    <Accordion.Panel>Account panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="security">
                    <Accordion.Control>Security</Accordion.Control>
                    <Accordion.Panel>Security panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        );

        await user.click(screen.getByRole("button", { name: "Security" }));

        expect(screen.getByText("Security panel")).toBeInTheDocument();
        expect(screen.queryByText("Account panel")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Security" }));

        expect(screen.queryByText("Security panel")).not.toBeInTheDocument();
    });

    it("supports multiple mode", async () => {
        const user = userEvent.setup();

        await render(
            <Accordion multiple defaultValue={["account"]}>
                <Accordion.Item value="account">
                    <Accordion.Control>Account</Accordion.Control>
                    <Accordion.Panel>Account panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="security">
                    <Accordion.Control>Security</Accordion.Control>
                    <Accordion.Panel>Security panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        );

        await user.click(screen.getByRole("button", { name: "Security" }));

        expect(screen.getByText("Account panel")).toBeInTheDocument();
        expect(screen.getByText("Security panel")).toBeInTheDocument();
    });

    it("supports controlled mode", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        function Demo() {
            const [value, setValue] = useState<string | null>("account");

            return (
                <Accordion
                    value={value}
                    onChange={(nextValue) => {
                        onChange(nextValue);

                        if (typeof nextValue === "string" || nextValue === null) {
                            setValue(nextValue);
                        }
                    }}
                >
                    <Accordion.Item value="account">
                        <Accordion.Control>Account</Accordion.Control>
                        <Accordion.Panel>Account panel</Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="security">
                        <Accordion.Control>Security</Accordion.Control>
                        <Accordion.Panel>Security panel</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            );
        }

        await render(<Demo />);

        await user.click(screen.getByRole("button", { name: "Security" }));

        expect(onChange).toHaveBeenCalledWith("security");
        expect(screen.getByText("Security panel")).toBeInTheDocument();
    });

    it("supports keyboard navigation and skips disabled items", async () => {
        const user = userEvent.setup();

        await render(
            <Accordion defaultValue="account">
                <Accordion.Item value="account">
                    <Accordion.Control>Account</Accordion.Control>
                    <Accordion.Panel>Account panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="security" disabled>
                    <Accordion.Control>Security</Accordion.Control>
                    <Accordion.Panel>Security panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="billing">
                    <Accordion.Control>Billing</Accordion.Control>
                    <Accordion.Panel>Billing panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        );

        const account = screen.getByRole("button", { name: "Account" });

        account.focus();
        await user.keyboard("{ArrowDown}");

        expect(screen.getByRole("button", { name: "Billing" })).toHaveFocus();

        await user.keyboard("{Home}");
        expect(account).toHaveFocus();

        await user.keyboard("{End}");
        expect(screen.getByRole("button", { name: "Billing" })).toHaveFocus();
    });

    it("keeps closed panels mounted when keepMounted is true", async () => {
        await render(
            <Accordion defaultValue="account" keepMounted>
                <Accordion.Item value="account">
                    <Accordion.Control>Account</Accordion.Control>
                    <Accordion.Panel>Account panel</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="security">
                    <Accordion.Control>Security</Accordion.Control>
                    <Accordion.Panel>Security panel</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        );

        const hiddenPanel = screen.getByText("Security panel");

        expect(hiddenPanel).toBeInTheDocument();
        expect(hiddenPanel).toHaveAttribute("hidden");
    });
});
