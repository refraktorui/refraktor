import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Portal from "./portal";

describe("@refraktor/core/Portal", () => {
    it("renders into document.body by default", async () => {
        await render(
            <div data-testid="root">
                <Portal>
                    <div data-testid="content">Portal content</div>
                </Portal>
            </div>
        );

        const root = screen.getByTestId("root");
        const content = await screen.findByTestId("content");

        expect(document.body).toContainElement(content);
        expect(root).not.toContainElement(content);
    });

    it("renders into custom target", async () => {
        const target = document.createElement("div");
        target.id = "portal-target";
        document.body.appendChild(target);

        await render(
            <Portal target="#portal-target">
                <div data-testid="content">Targeted content</div>
            </Portal>
        );

        const content = await screen.findByTestId("content");

        expect(target).toContainElement(content);

        target.remove();
    });
});
