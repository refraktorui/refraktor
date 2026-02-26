import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Pagination,
    type PaginationClassNames,
    type PaginationVariant,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/pagination/")({
    component: RouteComponent
});

function formatBooleanProp(
    name: string,
    value: boolean,
    defaultValue: boolean
): string | null {
    if (value === defaultValue) {
        return null;
    }

    return value ? name : `${name}={false}`;
}

const PaginationPlayground = createPlayground(
    {
        total: {
            type: "number",
            label: "Total Pages",
            min: 1,
            max: 50,
            step: 1,
            default: 20
        },
        defaultValue: {
            type: "number",
            label: "Default Page",
            min: 1,
            max: 50,
            step: 1,
            default: 7
        },
        siblings: {
            type: "number",
            label: "Siblings",
            min: 0,
            max: 4,
            step: 1,
            default: 1
        },
        boundaries: {
            type: "number",
            label: "Boundaries",
            min: 0,
            max: 4,
            step: 1,
            default: 1
        },
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
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "filled", "outline", "ghost"] as const,
            default: "default"
        },
        withControls: {
            type: "switch",
            label: "Controls",
            default: true
        },
        withEdges: {
            type: "switch",
            label: "Edges",
            default: false
        },
        hideWithOnePage: {
            type: "switch",
            label: "Hide One Page",
            default: false
        },
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const safeDefaultPage = Math.min(
                Math.max(1, props.defaultValue),
                props.total
            );

            const rootProps = [
                `total={${props.total}}`,
                `defaultValue={${safeDefaultPage}}`,
                props.siblings !== defaults.siblings
                    ? `siblings={${props.siblings}}`
                    : null,
                props.boundaries !== defaults.boundaries
                    ? `boundaries={${props.boundaries}}`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.variant !== defaults.variant
                    ? `variant="${props.variant}"`
                    : null,
                formatBooleanProp(
                    "withControls",
                    props.withControls,
                    defaults.withControls as boolean
                ),
                formatBooleanProp(
                    "withEdges",
                    props.withEdges,
                    defaults.withEdges as boolean
                ),
                formatBooleanProp(
                    "hideWithOnePage",
                    props.hideWithOnePage,
                    defaults.hideWithOnePage as boolean
                ),
                formatBooleanProp(
                    "disabled",
                    props.disabled,
                    defaults.disabled as boolean
                )
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [`import { Pagination } from "@refraktor/core";`],
                jsx: `<Pagination\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n/>`
            });
        }
    }
);

interface PaginationSlotsShowcaseProps {
    classNames?: PaginationClassNames;
}

function PaginationSlotsShowcase({ classNames }: PaginationSlotsShowcaseProps) {
    return (
        <Pagination
            total={18}
            defaultValue={8}
            withEdges
            classNames={classNames}
        />
    );
}

function ControlledPaginationShowcase() {
    const [page, setPage] = useState(4);

    return (
        <div className="w-full max-w-xl space-y-3">
            <Pagination total={12} value={page} onChange={setPage} />
            <p className="text-sm text-dark-200">Current page: {page}</p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Pagination"
                description="Navigate between multi-page datasets with compact ranges, edge controls, and full keyboard-accessible page actions."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/pagination/pagination.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <PaginationPlayground.Wrapper>
                            <PaginationPlayground.Preview>
                                {({
                                    total,
                                    defaultValue,
                                    siblings,
                                    boundaries,
                                    size,
                                    radius,
                                    variant,
                                    withControls,
                                    withEdges,
                                    hideWithOnePage,
                                    disabled
                                }) => {
                                    const safeDefaultPage = Math.min(
                                        Math.max(1, defaultValue),
                                        total
                                    );

                                    return (
                                        <Pagination
                                            key={`${total}-${safeDefaultPage}-${siblings}-${boundaries}-${size}-${radius}-${variant}-${withControls}-${withEdges}-${hideWithOnePage}-${disabled}`}
                                            total={total}
                                            defaultValue={safeDefaultPage}
                                            siblings={siblings}
                                            boundaries={boundaries}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            variant={variant as PaginationVariant}
                                            withControls={withControls}
                                            withEdges={withEdges}
                                            hideWithOnePage={hideWithOnePage}
                                            disabled={disabled}
                                        />
                                    );
                                }}
                            </PaginationPlayground.Preview>

                            <PaginationPlayground.Controls />

                            <PaginationPlayground.Code />
                        </PaginationPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use value and onChange when page state is owned by your data-fetching or routing layer."
                    >
                        <Documentation.Showcase
                            code={`import { Pagination } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [page, setPage] = useState(4);

  return (
    <>
      <Pagination total={12} value={page} onChange={setPage} />
      <p>Current page: {page}</p>
    </>
  );
}`}
                        >
                            <ControlledPaginationShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="edge-controls"
                        title="Edge controls"
                        description="Enable first and last buttons with withEdges for faster navigation across long page lists."
                    >
                        <Documentation.Showcase
                            code={`import { Pagination } from "@refraktor/core";

export function Demo() {
  return <Pagination total={24} defaultValue={12} withEdges />;
}`}
                        >
                            <Pagination total={24} defaultValue={12} withEdges />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="compact-range"
                        title="Compact range"
                        description="Adjust siblings and boundaries to keep the control compact while preserving context around the active page."
                    >
                        <Documentation.Showcase
                            code={`import { Pagination } from "@refraktor/core";

export function Demo() {
  return (
    <Pagination
      total={40}
      defaultValue={20}
      siblings={0}
      boundaries={1}
      variant="outline"
    />
  );
}`}
                        >
                            <Pagination
                                total={40}
                                defaultValue={20}
                                siblings={0}
                                boundaries={1}
                                variant="outline"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Pagination."
                    >
                        <Documentation.ClassesInspector
                            Component={PaginationSlotsShowcase}
                            slots={[
                                "root",
                                "list",
                                "item",
                                "page",
                                "control",
                                "dots",
                                "first",
                                "previous",
                                "next",
                                "last"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="pagination-props"
                        title="Pagination Props"
                        description="The props for the Pagination component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="total"
                                type="number"
                                description="Total number of available pages."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="number"
                                description="Controlled active page."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="number"
                                default="1"
                                description="Initial page for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: number) => void"
                                description="Called when the active page changes."
                            />
                            <Documentation.Props.Content
                                name="siblings"
                                type="number"
                                default="1"
                                description="Number of pages shown around the active page."
                            />
                            <Documentation.Props.Content
                                name="boundaries"
                                type="number"
                                default="1"
                                description="Number of always-visible pages at the start and end."
                            />
                            <Documentation.Props.Content
                                name="withControls"
                                type="boolean"
                                default="true"
                                description="Shows previous and next controls."
                            />
                            <Documentation.Props.Content
                                name="withEdges"
                                type="boolean"
                                default="false"
                                description="Shows first and last controls."
                            />
                            <Documentation.Props.Content
                                name="hideWithOnePage"
                                type="boolean"
                                default="false"
                                description="Hides the component when total equals one."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables all page and control buttons."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls button sizing and icon scale."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius of pagination items."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline" | "ghost"'
                                default='"default"'
                                description="Controls visual style for pages and controls."
                            />
                            <Documentation.Props.Content
                                name="getItemAriaLabel"
                                type="(type: PaginationAriaLabelType, page: number, selected: boolean) => string"
                                description="Provides custom aria-label text for page and control buttons."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root nav element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="PaginationClassNames"
                                description="Slot-level class overrides for root, list, item, page, control, dots, and edge controls."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
