import { useState } from "react";
import { render as rtlRender } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import { ThemeProvider } from "../../theme";
import Pagination from "./pagination";

describe("@refraktor/core/Pagination", () => {
    it("renders active page and controls", async () => {
        await render(<Pagination total={7} defaultValue={3} />);

        expect(
            screen.getByRole("button", { name: "Page 3, current page" })
        ).toHaveAttribute("aria-current", "page");
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Go to next page" })
        ).toBeInTheDocument();
    });

    it("calls onChange when next button is clicked", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(<Pagination total={7} value={2} onChange={onChange} />);

        await user.click(
            screen.getByRole("button", { name: "Go to next page" })
        );

        expect(onChange).toHaveBeenCalledWith(3);
    });

    it("supports controlled mode", async () => {
        const user = userEvent.setup();

        function Demo() {
            const [page, setPage] = useState(1);

            return <Pagination total={8} value={page} onChange={setPage} />;
        }

        await render(<Demo />);

        await user.click(screen.getByRole("button", { name: "Go to page 4" }));

        expect(
            screen.getByRole("button", { name: "Page 4, current page" })
        ).toHaveAttribute("aria-current", "page");
    });

    it("renders dots when the range is large", async () => {
        await render(<Pagination total={20} defaultValue={10} />);

        expect(screen.getAllByText("...")).toHaveLength(2);
    });

    it("supports edge controls and disabled boundary states", async () => {
        await render(<Pagination total={10} defaultValue={1} withEdges />);

        expect(
            screen.getByRole("button", { name: "Go to first page" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Go to next page" })
        ).not.toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Go to last page" })
        ).not.toBeDisabled();
    });

    it("hides when total is one and hideWithOnePage is true", () => {
        const { container } = rtlRender(
            <ThemeProvider>
                <Pagination total={1} hideWithOnePage />
            </ThemeProvider>
        );

        expect(container.firstChild).toBeNull();
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <Pagination
                total={20}
                defaultValue={10}
                className="custom-root"
                classNames={{
                    list: "custom-list",
                    item: "custom-item",
                    page: "custom-page",
                    control: "custom-control",
                    dots: "custom-dots"
                }}
            />
        );

        const root = container.firstElementChild as HTMLElement;
        const list = root.querySelector("ul");

        expect(root).toHaveClass("custom-root");
        expect(list).toHaveClass("custom-list");
        expect(root.querySelector("li")).toHaveClass("custom-item");
        expect(root.querySelector('[data-active="true"]')).toHaveClass(
            "custom-page"
        );
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).toHaveClass("custom-control");
        expect(screen.getAllByText("...")[0]).toHaveClass("custom-dots");
    });
});
