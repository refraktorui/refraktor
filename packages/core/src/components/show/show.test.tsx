import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../vitest";
import Show from "./show";

describe("@refraktor/core/Show", () => {
    it("renders children when when is truthy", async () => {
        await render(
            <Show when={true} fallback={<span>Hidden</span>}>
                <span>Visible</span>
            </Show>
        );

        expect(screen.queryByText("Visible")).not.toBeNull();
        expect(screen.queryByText("Hidden")).toBeNull();
    });

    it("renders fallback when when is falsy", async () => {
        await render(
            <Show when={false} fallback={<span>No content</span>}>
                <span>Visible</span>
            </Show>
        );

        expect(screen.queryByText("No content")).not.toBeNull();
        expect(screen.queryByText("Visible")).toBeNull();
    });

    it("renders nothing when when is falsy and fallback is not set", async () => {
        const { container } = await render(
            <Show when={""}>
                <span>Visible</span>
            </Show>
        );

        expect(container.innerHTML).toBe("");
    });

    it("supports function children and passes when value", async () => {
        const user = { id: "u-1", name: "Alex" };
        const children = vi.fn((value: typeof user) => <span>{value.name}</span>);

        await render(<Show when={user}>{children}</Show>);

        expect(children).toHaveBeenCalledTimes(1);
        expect(children).toHaveBeenCalledWith(user);
        expect(screen.queryByText("Alex")).not.toBeNull();
    });

    it("does not call function children when when is falsy", async () => {
        const children = vi.fn(() => <span>Visible</span>);

        await render(
            <Show when={0} fallback={<span>Hidden</span>}>
                {children}
            </Show>
        );

        expect(children).not.toHaveBeenCalled();
        expect(screen.queryByText("Hidden")).not.toBeNull();
    });
});
