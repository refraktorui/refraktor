import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../vitest";
import Table from "./table";

describe("@refraktor/core/Table", () => {
    it("renders semantic table structure with subcomponents", async () => {
        await render(
            <Table>
                <Table.Caption>Users</Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Ada</Table.Cell>
                        <Table.Cell>ada@example.com</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("Users")).toBeInTheDocument();
        expect(
            screen.getByRole("columnheader", { name: "Name" })
        ).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: "Ada" })).toBeInTheDocument();
    });

    it("applies body behavior styles", async () => {
        const { container } = await render(
            <Table striped highlightOnHover withRowBorders>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Ada</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        const body = container.querySelector("tbody") as HTMLTableSectionElement;

        expect(body.className).toContain("nth-child(odd)");
        expect(body.className).toContain("[&_tr:hover]:bg-[var(--refraktor-bg-hover)]");
        expect(body.className).toContain("[&_tr]:border-b");
    });

    it("applies column borders and size styles", async () => {
        await render(
            <Table withColumnBorders size="xl">
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Ada</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        const headerCell = screen.getByRole("columnheader", { name: "Name" });
        const cell = screen.getByRole("cell", { name: "Ada" });

        expect(headerCell.className).toContain("border-r");
        expect(cell.className).toContain("border-r");
        expect(cell.className).toContain("px-4");
    });

    it("supports root and slot class names", async () => {
        const { container } = await render(
            <Table
                className="custom-root"
                classNames={{
                    head: "custom-head",
                    body: "custom-body",
                    row: "custom-row",
                    headerCell: "custom-header-cell",
                    cell: "custom-cell",
                    caption: "custom-caption"
                }}
            >
                <Table.Caption>Users</Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Ada</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        const root = container.firstElementChild as HTMLTableElement;
        const head = container.querySelector("thead") as HTMLTableSectionElement;
        const body = container.querySelector("tbody") as HTMLTableSectionElement;
        const row = screen.getAllByRole("row")[0];
        const headerCell = screen.getByRole("columnheader", { name: "Name" });
        const cell = screen.getByRole("cell", { name: "Ada" });
        const caption = screen.getByText("Users");

        expect(root).toHaveClass("custom-root");
        expect(head).toHaveClass("custom-head");
        expect(body).toHaveClass("custom-body");
        expect(row).toHaveClass("custom-row");
        expect(headerCell).toHaveClass("custom-header-cell");
        expect(cell).toHaveClass("custom-cell");
        expect(caption).toHaveClass("custom-caption");
    });

    it("forwards ref to table root", async () => {
        const ref = createRef<HTMLTableElement>();

        await render(
            <Table ref={ref}>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Ada</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        expect(ref.current).toBeInstanceOf(HTMLTableElement);
        expect(ref.current?.tagName).toBe("TABLE");
    });
});
