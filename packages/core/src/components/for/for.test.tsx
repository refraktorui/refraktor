import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../vitest";
import For from "./for";

describe("@refraktor/core/For", () => {
    it("renders fallback for empty collections", async () => {
        const children = vi.fn(() => <span>Should not render</span>);

        await render(
            <For each={[]} fallback={<span>No items</span>}>
                {children}
            </For>
        );

        expect(screen.getByText("No items")).toBeInTheDocument();
        expect(children).not.toHaveBeenCalled();
    });

    it("renders nothing when collection is empty and fallback is not set", async () => {
        const { container } = await render(
            <For each={[]}>{() => <span>Should not render</span>}</For>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("passes item metadata to children", async () => {
        await render(
            <For each={["alpha", "beta", "gamma"]}>
                {(item, meta) => (
                    <div data-testid={item}>
                        {item}:{meta.index}:{meta.length}:
                        {String(meta.isFirst)}:{String(meta.isLast)}:
                        {meta.previous ?? "none"}:{meta.next ?? "none"}
                    </div>
                )}
            </For>
        );

        expect(screen.getByTestId("alpha")).toHaveTextContent(
            "alpha:0:3:true:false:none:beta"
        );
        expect(screen.getByTestId("beta")).toHaveTextContent(
            "beta:1:3:false:false:alpha:gamma"
        );
        expect(screen.getByTestId("gamma")).toHaveTextContent(
            "gamma:2:3:false:true:beta:none"
        );
    });

    it("supports iterable collections and calls key extractor", async () => {
        const values = new Set(["one", "two"]);
        const keyExtractor = vi.fn((item: string) => item);

        await render(
            <For each={values} keyExtractor={keyExtractor}>
                {(item) => <span>{item}</span>}
            </For>
        );

        expect(screen.getByText("one")).toBeInTheDocument();
        expect(screen.getByText("two")).toBeInTheDocument();
        expect(keyExtractor).toHaveBeenNthCalledWith(1, "one", 0);
        expect(keyExtractor).toHaveBeenNthCalledWith(2, "two", 1);
    });
});
