import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Portal from "./portal";

describe("@refraktor/core/Portal", () => {
    it("renders into document.body by default", () => {
        render(
            <div data-testid="root">
                <Portal>
                    <div data-testid="content">Portal content</div>
                </Portal>
            </div>
        );

        const root = screen.getByTestId("root");
        const content = screen.getByTestId("content");

        expect(document.body).toContainElement(content);
        expect(root).not.toContainElement(content);
    });

    it("renders inline when withinPortal is false", () => {
        render(
            <div data-testid="root">
                <Portal withinPortal={false}>
                    <div data-testid="content">Inline content</div>
                </Portal>
            </div>
        );

        const root = screen.getByTestId("root");
        const content = screen.getByTestId("content");

        expect(root).toContainElement(content);
    });

    it("renders into custom target", () => {
        const target = document.createElement("div");
        target.id = "portal-target";
        document.body.appendChild(target);

        render(
            <Portal target="#portal-target">
                <div data-testid="content">Targeted content</div>
            </Portal>
        );

        const content = screen.getByTestId("content");

        expect(target).toContainElement(content);

        target.remove();
    });
});
