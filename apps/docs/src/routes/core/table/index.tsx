import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Table,
    type RefraktorRadius,
    type RefraktorSize,
    type TableClassNames
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/table/")({
    component: RouteComponent
});

const rows = [
    {
        id: "INV-1042",
        customer: "Acme Studio",
        amount: "$1,240.00",
        status: "Paid"
    },
    {
        id: "INV-1043",
        customer: "Northwind Labs",
        amount: "$860.00",
        status: "Pending"
    },
    {
        id: "INV-1044",
        customer: "Blue Dot Co.",
        amount: "$2,130.00",
        status: "Overdue"
    }
];

const TablePlayground = createPlayground(
    {
        size: {
            type: "select",
            label: "Size",
            options: ["xs", "sm", "md", "lg", "xl"] as const,
            default: "md"
        },
        radius: {
            type: "select",
            label: "Radius",
            options: [
                "none",
                "xs",
                "sm",
                "md",
                "lg",
                "xl",
                "2xl",
                "3xl",
                "4xl",
                "full"
            ] as const,
            default: "default"
        },
        striped: {
            type: "switch",
            label: "Striped",
            default: false
        },
        highlightOnHover: {
            type: "switch",
            label: "Hover Highlight",
            default: false
        },
        withRowBorders: {
            type: "switch",
            label: "Row Borders",
            default: true
        },
        withColumnBorders: {
            type: "switch",
            label: "Column Borders",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.striped ? "striped" : null,
                props.highlightOnHover ? "highlightOnHover" : null,
                props.withRowBorders !== defaults.withRowBorders
                    ? props.withRowBorders
                        ? "withRowBorders"
                        : "withRowBorders={false}"
                    : null,
                props.withColumnBorders ? "withColumnBorders" : null
            ].filter((value): value is string => value !== null);

            const additionalProps =
                rootProps.length > 0
                    ? `\n${rootProps.map((prop) => `  ${prop}`).join("\n")}`
                    : "";

            return createSnippet({
                imports: [`import { Table } from "@refraktor/core";`],
                jsx: `<Table${additionalProps}>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Invoice</Table.HeaderCell>
      <Table.HeaderCell>Customer</Table.HeaderCell>
      <Table.HeaderCell>Amount</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Head>

  <Table.Body>
    <Table.Row>
      <Table.Cell>INV-1042</Table.Cell>
      <Table.Cell>Acme Studio</Table.Cell>
      <Table.Cell>$1,240.00</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`
            });
        }
    }
);

interface TableSlotsShowcaseProps {
    classNames?: TableClassNames;
}

function TableSlotsShowcase({ classNames }: TableSlotsShowcaseProps) {
    return (
        <div className="w-full overflow-x-auto">
            <Table classNames={classNames} striped highlightOnHover>
                <Table.Caption>Quarterly Revenue</Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Quarter</Table.HeaderCell>
                        <Table.HeaderCell>Revenue</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Q1</Table.Cell>
                        <Table.Cell>$48,000</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Q2</Table.Cell>
                        <Table.Cell>$52,000</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Table"
                description="Build semantic data tables with composable subcomponents, optional striping, hover states, and row or column borders."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/table/table.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <TablePlayground.Wrapper>
                            <TablePlayground.Preview>
                                {({
                                    size,
                                    radius,
                                    striped,
                                    highlightOnHover,
                                    withRowBorders,
                                    withColumnBorders
                                }) => (
                                    <div className="w-full overflow-x-auto">
                                        <Table
                                            key={`${size}-${radius}-${striped}-${highlightOnHover}-${withRowBorders}-${withColumnBorders}`}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            striped={striped}
                                            highlightOnHover={highlightOnHover}
                                            withRowBorders={withRowBorders}
                                            withColumnBorders={withColumnBorders}
                                        >
                                            <Table.Head>
                                                <Table.Row>
                                                    <Table.HeaderCell>
                                                        Invoice
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        Customer
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        Amount
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        Status
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Head>

                                            <Table.Body>
                                                {rows.map((row) => (
                                                    <Table.Row key={row.id}>
                                                        <Table.Cell>
                                                            {row.id}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {row.customer}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {row.amount}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {row.status}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                )}
                            </TablePlayground.Preview>

                            <TablePlayground.Controls />

                            <TablePlayground.Code />
                        </TablePlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="caption"
                        title="Caption"
                        description="Use Table.Caption to add context for screen readers and visible metadata for users."
                    >
                        <Documentation.Showcase
                            code={`import { Table } from "@refraktor/core";

export function Demo() {
  return (
    <Table>
      <Table.Caption>Monthly active users by plan</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Plan</Table.HeaderCell>
          <Table.HeaderCell>Users</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Starter</Table.Cell>
          <Table.Cell>1,204</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}`}
                        >
                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <Table.Caption>
                                        Monthly active users by plan
                                    </Table.Caption>
                                    <Table.Head>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                Plan
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Users
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Head>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Starter</Table.Cell>
                                            <Table.Cell>1,204</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Pro</Table.Cell>
                                            <Table.Cell>684</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="borders-and-stripes"
                        title="Borders and stripes"
                        description="Mix striped rows, hover highlighting, and optional column separators based on table density and readability needs."
                    >
                        <Documentation.Showcase
                            code={`import { Table } from "@refraktor/core";

export function Demo() {
  return (
    <Table striped highlightOnHover withColumnBorders>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Project</Table.HeaderCell>
          <Table.HeaderCell>Owner</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Client portal</Table.Cell>
          <Table.Cell>Alex</Table.Cell>
          <Table.Cell>In review</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}`}
                        >
                            <div className="w-full overflow-x-auto">
                                <Table striped highlightOnHover withColumnBorders>
                                    <Table.Head>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                Project
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Owner
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Status
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Head>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>
                                                Client portal
                                            </Table.Cell>
                                            <Table.Cell>Alex</Table.Cell>
                                            <Table.Cell>In review</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                Billing revamp
                                            </Table.Cell>
                                            <Table.Cell>Jordan</Table.Cell>
                                            <Table.Cell>Blocked</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Table."
                    >
                        <Documentation.ClassesInspector
                            Component={TableSlotsShowcase}
                            slots={[
                                "root",
                                "head",
                                "body",
                                "row",
                                "headerCell",
                                "cell",
                                "caption"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="table-props"
                        title="Table Props"
                        description="The props for the Table root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Table structure built with subcomponents like Table.Head, Table.Body, and Table.Row."
                                required
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Shared sizing for header cells, body cells, and caption text."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Border radius applied to the table root."
                            />
                            <Documentation.Props.Content
                                name="striped"
                                type="boolean"
                                default="false"
                                description="Applies alternating background to odd body rows."
                            />
                            <Documentation.Props.Content
                                name="highlightOnHover"
                                type="boolean"
                                default="false"
                                description="Highlights body rows on hover."
                            />
                            <Documentation.Props.Content
                                name="withRowBorders"
                                type="boolean"
                                default="true"
                                description="Shows horizontal borders between body rows."
                            />
                            <Documentation.Props.Content
                                name="withColumnBorders"
                                type="boolean"
                                default="false"
                                description="Shows vertical separators between cells."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the table root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="TableClassNames"
                                description="Slot-level class overrides for root, head, body, row, headerCell, cell, and caption."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="table-subcomponent-props"
                        title="Subcomponent Props"
                        description="Each table subcomponent supports children and className for structure and styling overrides."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="Table.Head"
                                type="TableHeadProps"
                                description="Wraps header rows and inherits table styling context."
                            />
                            <Documentation.Props.Content
                                name="Table.Body"
                                type="TableBodyProps"
                                description="Wraps body rows and applies striped/hover/border behaviors."
                            />
                            <Documentation.Props.Content
                                name="Table.Row"
                                type="TableRowProps"
                                description="Renders a semantic table row in head or body sections."
                            />
                            <Documentation.Props.Content
                                name="Table.HeaderCell"
                                type="TableHeaderCellProps"
                                description="Renders a semantic th cell with shared sizing and optional borders."
                            />
                            <Documentation.Props.Content
                                name="Table.Cell"
                                type="TableCellProps"
                                description="Renders a semantic td cell with shared sizing and optional borders."
                            />
                            <Documentation.Props.Content
                                name="Table.Caption"
                                type="TableCaptionProps"
                                description="Renders an optional caption above the table content."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
