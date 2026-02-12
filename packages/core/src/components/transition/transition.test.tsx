import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../vitest";
import Transition from "./transition";

describe("@refraktor/core/Transition", () => {
    it("unmounts content after exit by default", () => {
        const { rerender } = render(
            <Transition mounted transition="fade" immediate>
                <div data-testid="content">Content</div>
            </Transition>
        );

        expect(screen.getByTestId("content")).toBeInTheDocument();

        rerender(
            <Transition mounted={false} transition="fade" immediate>
                <div data-testid="content">Content</div>
            </Transition>
        );

        expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });

    it("keeps content mounted when keepMounted is true", () => {
        const { rerender } = render(
            <Transition
                mounted
                keepMounted
                transition="fade"
                immediate
                data-testid="transition"
            >
                Content
            </Transition>
        );

        rerender(
            <Transition
                mounted={false}
                keepMounted
                transition="fade"
                immediate
                data-testid="transition"
            >
                Content
            </Transition>
        );

        const node = screen.getByTestId("transition");
        expect(node).toBeInTheDocument();
        expect(node).toHaveAttribute("data-transition-state", "exited");
    });

    it("fires lifecycle callbacks and forwards root props", () => {
        const onEnterStart = vi.fn();
        const onEnterEnd = vi.fn();
        const onExitStart = vi.fn();
        const onExitEnd = vi.fn();
        const onStateChange = vi.fn();

        const { rerender } = render(
            <Transition
                mounted={false}
                keepMounted
                immediate
                id="custom-id"
                className="custom-class"
                data-testid="transition"
                onEnterStart={onEnterStart}
                onEnterEnd={onEnterEnd}
                onExitStart={onExitStart}
                onExitEnd={onExitEnd}
                onStateChange={onStateChange}
            >
                {(state) => <span>{state}</span>}
            </Transition>
        );

        rerender(
            <Transition
                mounted
                keepMounted
                immediate
                id="custom-id"
                className="custom-class"
                data-testid="transition"
                onEnterStart={onEnterStart}
                onEnterEnd={onEnterEnd}
                onExitStart={onExitStart}
                onExitEnd={onExitEnd}
                onStateChange={onStateChange}
            >
                {(state) => <span>{state}</span>}
            </Transition>
        );

        rerender(
            <Transition
                mounted={false}
                keepMounted
                immediate
                id="custom-id"
                className="custom-class"
                data-testid="transition"
                onEnterStart={onEnterStart}
                onEnterEnd={onEnterEnd}
                onExitStart={onExitStart}
                onExitEnd={onExitEnd}
                onStateChange={onStateChange}
            >
                {(state) => <span>{state}</span>}
            </Transition>
        );

        const node = screen.getByTestId("transition");

        expect(node).toHaveAttribute("id", "custom-id");
        expect(node).toHaveClass("custom-class");
        expect(onEnterStart).toHaveBeenCalledTimes(1);
        expect(onEnterEnd).toHaveBeenCalledTimes(1);
        expect(onExitStart).toHaveBeenCalledTimes(1);
        expect(onExitEnd).toHaveBeenCalledTimes(1);
        expect(onStateChange).toHaveBeenCalledWith("entered");
        expect(onStateChange).toHaveBeenCalledWith("exited");
    });
});
