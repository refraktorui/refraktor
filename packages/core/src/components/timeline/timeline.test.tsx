import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Timeline from "./timeline";

describe("@refraktor/core/Timeline", () => {
    it("renders timeline items with title and children description", async () => {
        await render(
            <Timeline>
                <Timeline.Item title="Project started">Planning</Timeline.Item>
                <Timeline.Item title="In progress">Building</Timeline.Item>
            </Timeline>
        );

        expect(screen.getByRole("list")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("Project started")).toBeInTheDocument();
        expect(screen.getByText("Building")).toBeInTheDocument();
    });

    it("renders date above title", async () => {
        await render(
            <Timeline>
                <Timeline.Item date="Mar 2026" title="Project started">
                    Planning
                </Timeline.Item>
            </Timeline>
        );

        const date = screen.getByText("Mar 2026");
        const title = screen.getByText("Project started");

        expect(date).toHaveAttribute("data-timeline-date", "true");
        expect(
            date.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });

    it("supports horizontal orientation", async () => {
        const { container } = await render(
            <Timeline orientation="horizontal">
                <Timeline.Item title="Step 1" />
                <Timeline.Item title="Step 2" />
            </Timeline>
        );

        const root = container.firstElementChild as HTMLDivElement;
        const item = screen.getAllByRole("listitem")[0];

        expect(root).toHaveAttribute("data-orientation", "horizontal");
        expect(item).toHaveAttribute("data-orientation", "horizontal");
    });

    it("hides the connector on the last item", async () => {
        const { container } = await render(
            <Timeline>
                <Timeline.Item title="One" />
                <Timeline.Item title="Two" />
                <Timeline.Item title="Three" />
            </Timeline>
        );

        const connectors = container.querySelectorAll(
            '[data-timeline-connector="true"]'
        );

        expect(connectors).toHaveLength(2);
    });

    it("marks current and previous items active from root active prop", async () => {
        const { container } = await render(
            <Timeline lineVariant="dashed" active={1}>
                <Timeline.Item title="Done" />
                <Timeline.Item title="Now" />
            </Timeline>
        );

        const items = screen.getAllByRole("listitem");
        const connector = container.querySelector(
            '[data-timeline-connector="true"]'
        );

        expect(items[0]).toHaveAttribute("data-active", "true");
        expect(items[1]).toHaveAttribute("data-active", "true");
        expect(connector).toHaveClass("border-dashed");
    });

    it("marks all items active when active exceeds the last index", async () => {
        await render(
            <Timeline active={10}>
                <Timeline.Item title="One" />
                <Timeline.Item title="Two" />
            </Timeline>
        );

        const items = screen.getAllByRole("listitem");

        expect(items[0]).toHaveAttribute("data-active", "true");
        expect(items[1]).toHaveAttribute("data-active", "true");
    });

    it("marks no items active when active is -1", async () => {
        await render(
            <Timeline active={-1}>
                <Timeline.Item title="One" />
                <Timeline.Item title="Two" />
            </Timeline>
        );

        const items = screen.getAllByRole("listitem");

        expect(items[0]).toHaveAttribute("data-active", "false");
        expect(items[1]).toHaveAttribute("data-active", "false");
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <Timeline
                className="custom-root"
                classNames={{
                    item: "custom-item",
                    bullet: "custom-bullet",
                    connector: "custom-connector",
                    date: "custom-date",
                    title: "custom-title"
                }}
            >
                <Timeline.Item date="Date" title="Entry">
                    Desc
                </Timeline.Item>
                <Timeline.Item title="Entry 2" />
            </Timeline>
        );

        const root = container.firstElementChild as HTMLDivElement;
        const item = screen.getAllByRole("listitem")[0];
        const bullet = container.querySelector('[data-timeline-bullet="true"]');
        const connector = container.querySelector(
            '[data-timeline-connector="true"]'
        );
        const date = screen.getByText("Date");
        const title = screen.getByText("Entry");

        expect(root).toHaveClass("custom-root");
        expect(item).toHaveClass("custom-item");
        expect(bullet).toHaveClass("custom-bullet");
        expect(connector).toHaveClass("custom-connector");
        expect(date).toHaveClass("custom-date");
        expect(title).toHaveClass("custom-title");
    });
});
