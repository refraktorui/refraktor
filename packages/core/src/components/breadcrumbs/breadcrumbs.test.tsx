import { render as rtlRender } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../../theme";
import { render, screen, userEvent } from "../../vitest";
import Breadcrumbs from "./breadcrumbs";

const items = [
    { label: "Home", href: "/" },
    { label: "Workspace", href: "/workspace" },
    { label: "Projects", href: "/workspace/projects" },
    { label: "Refraktor", href: "/workspace/projects/refraktor" },
    { label: "Components", href: "/workspace/projects/refraktor/components" },
    { label: "Breadcrumbs" }
];

describe("@refraktor/core/Breadcrumbs", () => {
    it("renders navigation, links and current page", async () => {
        await render(<Breadcrumbs items={items.slice(0, 3)} maxItems={0} />);

        expect(
            screen.getByRole("navigation", { name: "Breadcrumb" })
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
            "href",
            "/"
        );
        expect(screen.getByText("Projects")).toHaveAttribute(
            "aria-current",
            "page"
        );
    });

    it("collapses and expands middle items", async () => {
        const user = userEvent.setup();
        const onExpandedChange = vi.fn();

        await render(
            <Breadcrumbs
                items={items}
                maxItems={4}
                onExpandedChange={onExpandedChange}
            />
        );

        expect(screen.getByRole("button", { name: /show full breadcrumb path/i })).toBeInTheDocument();
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: /show full breadcrumb path/i })
        );

        expect(onExpandedChange).toHaveBeenCalledWith(true);
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /show full breadcrumb path/i })
        ).not.toBeInTheDocument();
    });

    it("supports itemsBeforeCollapse and itemsAfterCollapse", async () => {
        await render(
            <Breadcrumbs
                items={items}
                maxItems={4}
                itemsBeforeCollapse={2}
                itemsAfterCollapse={2}
            />
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Workspace")).toBeInTheDocument();
        expect(screen.getByText("Components")).toBeInTheDocument();
        expect(screen.getByText("Breadcrumbs")).toBeInTheDocument();
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
    });

    it("supports controlled expanded mode", async () => {
        await render(<Breadcrumbs items={items} maxItems={3} expanded />);

        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /show full breadcrumb path/i })
        ).not.toBeInTheDocument();
    });

    it("supports custom separator", async () => {
        await render(<Breadcrumbs items={items.slice(0, 3)} separator="/" />);

        expect(screen.getAllByText("/")).toHaveLength(2);
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <Breadcrumbs
                items={items}
                maxItems={4}
                className="custom-root"
                classNames={{
                    list: "custom-list",
                    item: "custom-item",
                    link: "custom-link",
                    current: "custom-current",
                    separator: "custom-separator",
                    collapse: "custom-collapse"
                }}
            />
        );

        const root = container.firstElementChild as HTMLElement;

        expect(root).toHaveClass("custom-root");
        expect(root.querySelector("ol")).toHaveClass("custom-list");
        expect(root.querySelector("li")).toHaveClass("custom-item");
        expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
            "custom-link"
        );
        expect(root.querySelector('[aria-current="page"]')).toHaveClass(
            "custom-current"
        );
        expect(
            screen.getByRole("button", { name: /show full breadcrumb path/i })
        ).toHaveClass("custom-collapse");
        expect(root.querySelector("span[aria-hidden='true']")).toHaveClass(
            "custom-separator"
        );
    });

    it("returns null when items array is empty", () => {
        const { container } = rtlRender(
            <ThemeProvider>
                <Breadcrumbs items={[]} />
            </ThemeProvider>
        );

        expect(container.firstChild).toBeNull();
    });
});
