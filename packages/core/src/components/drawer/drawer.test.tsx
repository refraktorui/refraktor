import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Drawer from "./drawer";
import { DrawerBody } from "./drawer-body";
import { DrawerContent } from "./drawer-content";
import { DrawerOverlay } from "./drawer-overlay";
import { DrawerRoot } from "./drawer-root";

describe("@refraktor/core/Drawer", () => {
    const transitionProps = {
        duration: 0,
        immediate: true
    } as const;

    it("renders with compound subcomponents and closes with header close button", async () => {
        const user = userEvent.setup();

        await render(
            <Drawer.Root defaultOpened transitionProps={transitionProps}>
                <Drawer.Overlay />

                <Drawer.Content>
                    <Drawer.Header text="Edit profile" />
                    <Drawer.Body>
                        <p>Drawer body</p>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        expect(
            await screen.findByRole("dialog", { name: "Edit profile" })
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    it("calls onOpenedChange when clicking overlay in controlled mode", async () => {
        const user = userEvent.setup();
        const onOpenedChange = vi.fn();

        await render(
            <Drawer.Root
                opened
                onOpenedChange={onOpenedChange}
                transitionProps={transitionProps}
            >
                <Drawer.Overlay data-testid="overlay" />
                <Drawer.Content>Controlled drawer</Drawer.Content>
            </Drawer.Root>
        );

        await user.click(await screen.findByTestId("overlay"));

        expect(onOpenedChange).toHaveBeenCalledWith(false);
    });

    it("closes on Escape key", async () => {
        const user = userEvent.setup();

        await render(
            <Drawer.Root defaultOpened transitionProps={transitionProps}>
                <Drawer.Content>Keyboard close</Drawer.Content>
            </Drawer.Root>
        );

        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    it("supports standalone subcomponents with DrawerRoot", async () => {
        await render(
            <DrawerRoot defaultOpened transitionProps={transitionProps}>
                <DrawerOverlay />
                <DrawerContent>Standalone composition</DrawerContent>
            </DrawerRoot>
        );

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("applies custom overlay background opacity and blur", async () => {
        await render(
            <Drawer.Root defaultOpened transitionProps={transitionProps}>
                <Drawer.Overlay
                    data-testid="overlay"
                    backgroundOpacity={0.4}
                    blur={6}
                />
                <Drawer.Content>Styled overlay</Drawer.Content>
            </Drawer.Root>
        );

        const overlay = await screen.findByTestId("overlay");

        expect(overlay).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)"
        });
    });

    it("supports different positions and predefined sizes", async () => {
        await render(
            <>
                <Drawer.Root
                    defaultOpened
                    position="left"
                    size="sm"
                    transitionProps={transitionProps}
                >
                    <Drawer.Content data-testid="left-content">
                        Left
                    </Drawer.Content>
                </Drawer.Root>

                <Drawer.Root
                    defaultOpened
                    position="bottom"
                    size="xl"
                    transitionProps={transitionProps}
                >
                    <Drawer.Content data-testid="bottom-content">
                        Bottom
                    </Drawer.Content>
                </Drawer.Root>
            </>
        );

        const leftContent = await screen.findByTestId("left-content");
        const bottomContent = await screen.findByTestId("bottom-content");

        expect(leftContent).toHaveAttribute("data-position", "left");
        expect(leftContent).toHaveStyle({ width: "20rem" });
        expect(bottomContent).toHaveAttribute("data-position", "bottom");
        expect(bottomContent).toHaveStyle({ height: "36rem" });
    });

    it("renders Drawer.Body subcomponent", async () => {
        await render(
            <Drawer.Root defaultOpened transitionProps={transitionProps}>
                <Drawer.Content>
                    <Drawer.Body data-testid="body">Body content</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const body = await screen.findByTestId("body");
        expect(body).toBeInTheDocument();
        expect(body).toHaveTextContent("Body content");
    });

    it("renders standalone DrawerBody component", async () => {
        await render(
            <DrawerRoot defaultOpened transitionProps={transitionProps}>
                <DrawerContent>
                    <DrawerBody data-testid="body">Standalone body</DrawerBody>
                </DrawerContent>
            </DrawerRoot>
        );

        expect(await screen.findByTestId("body")).toHaveTextContent(
            "Standalone body"
        );
    });

    describe("single-component shorthand API", () => {
        it("renders with title, overlay, close button, and body", async () => {
            await render(
                <Drawer
                    defaultOpened
                    title="Edit profile"
                    transitionProps={transitionProps}
                >
                    <p>Profile form</p>
                </Drawer>
            );

            expect(
                await screen.findByRole("dialog", { name: "Edit profile" })
            ).toBeInTheDocument();
            expect(screen.getByText("Profile form")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Close" })
            ).toBeInTheDocument();
        });

        it("hides overlay when withOverlay is false", async () => {
            const { container } = await render(
                <Drawer
                    defaultOpened
                    title="No overlay"
                    withOverlay={false}
                    transitionProps={transitionProps}
                />
            );

            expect(await screen.findByRole("dialog")).toBeInTheDocument();
            expect(
                container.ownerDocument.querySelector("[aria-hidden='true']")
            ).toBeNull();
        });

        it("hides close button when withCloseButton is false", async () => {
            await render(
                <Drawer
                    defaultOpened
                    title="No close"
                    withCloseButton={false}
                    transitionProps={transitionProps}
                />
            );

            await screen.findByRole("dialog");
            expect(
                screen.queryByRole("button", { name: "Close" })
            ).not.toBeInTheDocument();
        });

        it("closes via shorthand close button", async () => {
            const user = userEvent.setup();

            await render(
                <Drawer
                    defaultOpened
                    title="Closeable"
                    transitionProps={transitionProps}
                >
                    Content
                </Drawer>
            );

            await screen.findByRole("dialog");

            await user.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            });
        });

        it("passes overlayProps to the overlay", async () => {
            await render(
                <Drawer
                    defaultOpened
                    title="Custom overlay"
                    overlayProps={{
                        backgroundOpacity: 0.8,
                        blur: 10,
                        "data-testid": "shorthand-overlay"
                    } as any}
                    transitionProps={transitionProps}
                >
                    Content
                </Drawer>
            );

            const overlay = await screen.findByTestId("shorthand-overlay");

            expect(overlay).toHaveStyle({
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(10px)"
            });
        });
    });
});
