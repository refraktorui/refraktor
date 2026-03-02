import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Modal from "./modal";
import { ModalBody } from "./modal-body";
import { ModalContent } from "./modal-content";
import { ModalOverlay } from "./modal-overlay";
import { ModalRoot } from "./modal-root";

describe("@refraktor/core/Modal", () => {
    const transitionProps = {
        duration: 0,
        immediate: true
    } as const;

    it("renders with compound subcomponents and closes with header close button", async () => {
        const user = userEvent.setup();

        await render(
            <Modal.Root defaultOpened transitionProps={transitionProps}>
                <Modal.Overlay />

                <Modal.Content>
                    <Modal.Header>Delete item</Modal.Header>
                    <Modal.Body>
                        <p>Are you sure?</p>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        );

        expect(
            await screen.findByRole("dialog", { name: "Delete item" })
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
            <Modal.Root
                opened
                onOpenedChange={onOpenedChange}
                transitionProps={transitionProps}
            >
                <Modal.Overlay data-testid="overlay" />
                <Modal.Content>Controlled modal</Modal.Content>
            </Modal.Root>
        );

        await user.click(await screen.findByTestId("overlay"));

        expect(onOpenedChange).toHaveBeenCalledWith(false);
    });

    it("closes on Escape key", async () => {
        const user = userEvent.setup();

        await render(
            <Modal.Root defaultOpened transitionProps={transitionProps}>
                <Modal.Content>Keyboard close</Modal.Content>
            </Modal.Root>
        );

        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    it("supports strategy prop on Modal.Root", async () => {
        await render(
            <Modal.Root
                defaultOpened
                strategy="fixed"
                transitionProps={transitionProps}
            >
                <Modal.Content>Strategy modal</Modal.Content>
            </Modal.Root>
        );

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("supports standalone subcomponents with ModalRoot", async () => {
        await render(
            <ModalRoot defaultOpened transitionProps={transitionProps}>
                <ModalOverlay />
                <ModalContent>Standalone composition</ModalContent>
            </ModalRoot>
        );

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("applies custom overlay background opacity and blur", async () => {
        await render(
            <Modal.Root defaultOpened transitionProps={transitionProps}>
                <Modal.Overlay
                    data-testid="overlay"
                    backgroundOpacity={0.4}
                    blur={6}
                />
                <Modal.Content>Styled overlay</Modal.Content>
            </Modal.Root>
        );

        const overlay = await screen.findByTestId("overlay");

        expect(overlay).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)"
        });
    });

    it("does not set backdrop blur for zero blur", async () => {
        await render(
            <Modal.Root defaultOpened transitionProps={transitionProps}>
                <Modal.Overlay data-testid="overlay" blur={0} />
                <Modal.Content>No blur</Modal.Content>
            </Modal.Root>
        );

        const overlay = await screen.findByTestId("overlay");

        expect(overlay).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        });
        expect(overlay.style.backdropFilter).toBe("");
    });

    it("renders Modal.Body subcomponent", async () => {
        await render(
            <Modal.Root defaultOpened transitionProps={transitionProps}>
                <Modal.Content>
                    <Modal.Body data-testid="body">Body content</Modal.Body>
                </Modal.Content>
            </Modal.Root>
        );

        const body = await screen.findByTestId("body");
        expect(body).toBeInTheDocument();
        expect(body).toHaveTextContent("Body content");
    });

    it("renders standalone ModalBody component", async () => {
        await render(
            <ModalRoot defaultOpened transitionProps={transitionProps}>
                <ModalContent>
                    <ModalBody data-testid="body">Standalone body</ModalBody>
                </ModalContent>
            </ModalRoot>
        );

        expect(await screen.findByTestId("body")).toHaveTextContent(
            "Standalone body"
        );
    });

    describe("single-component shorthand API", () => {
        it("renders with title, overlay, close button, and body", async () => {
            await render(
                <Modal
                    defaultOpened
                    title="Confirm action"
                    transitionProps={transitionProps}
                >
                    <p>Are you sure?</p>
                </Modal>
            );

            expect(
                await screen.findByRole("dialog", { name: "Confirm action" })
            ).toBeInTheDocument();
            expect(screen.getByText("Are you sure?")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Close" })
            ).toBeInTheDocument();
        });

        it("hides overlay when withOverlay is false", async () => {
            const { container } = await render(
                <Modal
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
                <Modal
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
                <Modal
                    defaultOpened
                    title="Closeable"
                    transitionProps={transitionProps}
                >
                    Content
                </Modal>
            );

            await screen.findByRole("dialog");

            await user.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            });
        });

        it("passes overlayProps to the overlay", async () => {
            await render(
                <Modal
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
                </Modal>
            );

            const overlay = await screen.findByTestId("shorthand-overlay");

            expect(overlay).toHaveStyle({
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(10px)"
            });
        });
    });

    describe("size prop", () => {
        it("applies md size by default", async () => {
            await render(
                <Modal.Root defaultOpened transitionProps={transitionProps}>
                    <Modal.Content data-testid="content">
                        Default size
                    </Modal.Content>
                </Modal.Root>
            );

            const dialog = await screen.findByRole("dialog");
            expect(dialog.className).toContain("max-w-md");
        });

        it("applies custom size", async () => {
            await render(
                <Modal.Root
                    defaultOpened
                    size="lg"
                    transitionProps={transitionProps}
                >
                    <Modal.Content>Large modal</Modal.Content>
                </Modal.Root>
            );

            const dialog = await screen.findByRole("dialog");
            expect(dialog.className).toContain("max-w-lg");
        });
    });

    describe("centered prop", () => {
        it("centers vertically by default", async () => {
            await render(
                <Modal.Root defaultOpened transitionProps={transitionProps}>
                    <Modal.Content>Centered</Modal.Content>
                </Modal.Root>
            );

            await screen.findByRole("dialog");
            const wrapper =
                screen.getByRole("dialog").parentElement?.parentElement;
            expect(wrapper?.className).toContain("place-items-center");
        });

        it("positions at top when centered is false", async () => {
            await render(
                <Modal.Root
                    defaultOpened
                    centered={false}
                    transitionProps={transitionProps}
                >
                    <Modal.Content>Top aligned</Modal.Content>
                </Modal.Root>
            );

            await screen.findByRole("dialog");
            const wrapper =
                screen.getByRole("dialog").parentElement?.parentElement;
            expect(wrapper?.className).toContain("items-start");
        });
    });
});
