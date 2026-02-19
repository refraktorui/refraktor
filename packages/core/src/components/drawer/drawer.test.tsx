import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Drawer from "./drawer";
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
            <Drawer defaultOpened transitionProps={transitionProps}>
                <Drawer.Overlay />

                <Drawer.Content>
                    <Drawer.Header text="Edit profile" />
                    <p>Drawer body</p>
                </Drawer.Content>
            </Drawer>
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
            <Drawer
                opened
                onOpenedChange={onOpenedChange}
                transitionProps={transitionProps}
            >
                <Drawer.Overlay data-testid="overlay" />
                <Drawer.Content>Controlled drawer</Drawer.Content>
            </Drawer>
        );

        await user.click(await screen.findByTestId("overlay"));

        expect(onOpenedChange).toHaveBeenCalledWith(false);
    });

    it("closes on Escape key", async () => {
        const user = userEvent.setup();

        await render(
            <Drawer defaultOpened transitionProps={transitionProps}>
                <Drawer.Content>Keyboard close</Drawer.Content>
            </Drawer>
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
            <Drawer defaultOpened transitionProps={transitionProps}>
                <Drawer.Overlay
                    data-testid="overlay"
                    backgroundOpacity={0.4}
                    blur={6}
                />
                <Drawer.Content>Styled overlay</Drawer.Content>
            </Drawer>
        );

        const overlay = await screen.findByTestId("overlay");

        expect(overlay).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)"
        });
    });

    it("locks and unlocks body scroll when enabled", async () => {
        const user = userEvent.setup();

        await render(
            <Drawer defaultOpened lockScroll transitionProps={transitionProps}>
                <Drawer.Content>
                    Scroll locked
                    <Drawer.Close />
                </Drawer.Content>
            </Drawer>
        );

        await waitFor(() => {
            expect(document.body).toHaveAttribute("data-scroll-locked");
        });

        await user.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(document.body).not.toHaveAttribute("data-scroll-locked");
        });
    });

    it("supports different positions and predefined sizes", async () => {
        await render(
            <>
                <Drawer
                    defaultOpened
                    position="left"
                    size="sm"
                    transitionProps={transitionProps}
                >
                    <Drawer.Content data-testid="left-content">
                        Left
                    </Drawer.Content>
                </Drawer>

                <Drawer
                    defaultOpened
                    position="bottom"
                    size="xl"
                    transitionProps={transitionProps}
                >
                    <Drawer.Content data-testid="bottom-content">
                        Bottom
                    </Drawer.Content>
                </Drawer>
            </>
        );

        const leftContent = await screen.findByTestId("left-content");
        const bottomContent = await screen.findByTestId("bottom-content");

        expect(leftContent).toHaveAttribute("data-position", "left");
        expect(leftContent).toHaveStyle({ width: "20rem" });
        expect(bottomContent).toHaveAttribute("data-position", "bottom");
        expect(bottomContent).toHaveStyle({ height: "36rem" });
    });
});
