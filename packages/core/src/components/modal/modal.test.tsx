import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "../../vitest";
import Modal from "./modal";
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
            <Modal defaultOpened transitionProps={transitionProps}>
                <Modal.Overlay />

                <Modal.Content>
                    <Modal.Header text="Delete item" />
                    <p>Are you sure?</p>
                </Modal.Content>
            </Modal>
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
            <Modal
                opened
                onOpenedChange={onOpenedChange}
                transitionProps={transitionProps}
            >
                <Modal.Overlay data-testid="overlay" />
                <Modal.Content>Controlled modal</Modal.Content>
            </Modal>
        );

        await user.click(await screen.findByTestId("overlay"));

        expect(onOpenedChange).toHaveBeenCalledWith(false);
    });

    it("closes on Escape key", async () => {
        const user = userEvent.setup();

        await render(
            <Modal defaultOpened transitionProps={transitionProps}>
                <Modal.Content>Keyboard close</Modal.Content>
            </Modal>
        );

        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
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

    it("locks and unlocks body scroll when enabled", async () => {
        const user = userEvent.setup();

        await render(
            <Modal defaultOpened lockScroll transitionProps={transitionProps}>
                <Modal.Content>
                    Scroll locked
                    <Modal.Close />
                </Modal.Content>
            </Modal>
        );

        await waitFor(() => {
            expect(document.body).toHaveAttribute("data-scroll-locked");
        });

        await user.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(document.body).not.toHaveAttribute("data-scroll-locked");
        });
    });
});
