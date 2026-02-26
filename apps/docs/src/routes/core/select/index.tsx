import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Select,
    type RefraktorRadius,
    type RefraktorSize,
    type SelectClassNames
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/select/")({
    component: RouteComponent
});

type SelectVariant = "default" | "filled" | "outline";

const basicData = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" }
];

const groupedData = [
    {
        label: "Frontend",
        items: [
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" }
        ]
    },
    {
        label: "Backend",
        items: [
            { value: "node", label: "Node.js" },
            { value: "go", label: "Go" }
        ]
    }
];

const SelectPlayground = createPlayground(
    {
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "filled", "outline"] as const,
            default: "default"
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
        searchable: {
            type: "switch",
            label: "Searchable",
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
            return createSnippet({
                imports: [`import { Select } from "@refraktor/core";`],
                component: "Select",
                values: {
                    label: "Framework",
                    placeholder: "Select framework",
                    data: basicData,
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    searchable: props.searchable,
                    disabled: props.disabled
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    searchable: defaults.searchable,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface SelectSlotsShowcaseProps {
    classNames?: SelectClassNames;
}

function SelectSlotsShowcase({ classNames }: SelectSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <Select
                label="Framework"
                searchable
                opened
                onOpenedChange={() => {}}
                withinPortal={false}
                data={groupedData}
                classNames={classNames}
            />
        </div>
    );
}

function ControlledSelectShowcase() {
    const [value, setValue] = useState<string | null>("react");

    return (
        <div className="w-full max-w-md space-y-3">
            <Select
                label="Framework"
                value={value}
                onChange={setValue}
                data={basicData}
                withinPortal={false}
            />
            <p className="text-sm text-dark-200">Selected: {value ?? "none"}</p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Select"
                description="Choose one option from a dropdown with searchable lists, grouped options, and both data-driven and compound APIs."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/select/select.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <SelectPlayground.Wrapper>
                            <SelectPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    searchable,
                                    disabled
                                }) => (
                                    <div className="w-full max-w-md">
                                        <Select
                                            key={`${variant}-${size}-${radius}-${searchable}-${disabled}`}
                                            label="Framework"
                                            placeholder="Select framework"
                                            data={basicData}
                                            variant={variant as SelectVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            searchable={searchable}
                                            disabled={disabled}
                                            withinPortal={false}
                                        />
                                    </div>
                                )}
                            </SelectPlayground.Preview>

                            <SelectPlayground.Controls />

                            <SelectPlayground.Code />
                        </SelectPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="searchable"
                        title="Searchable options"
                        description="Enable searchable to filter long option lists directly inside the dropdown."
                    >
                        <Documentation.Showcase
                            code={`import { Select } from "@refraktor/core";

export function Demo() {
  return (
    <Select
      label="Library"
      searchable
      data={[
        { value: "react", label: "React" },
        { value: "solid", label: "Solid" },
        { value: "svelte", label: "Svelte" }
      ]}
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Select
                                    label="Library"
                                    searchable
                                    data={[
                                        { value: "react", label: "React" },
                                        { value: "solid", label: "Solid" },
                                        { value: "svelte", label: "Svelte" }
                                    ]}
                                    withinPortal={false}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="grouped-options"
                        title="Grouped options"
                        description="Provide grouped data to organize large lists into labeled categories."
                    >
                        <Documentation.Showcase
                            code={`import { Select } from "@refraktor/core";

export function Demo() {
  return (
    <Select
      label="Stack"
      data={[
        {
          label: "Frontend",
          items: [
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" }
          ]
        },
        {
          label: "Backend",
          items: [
            { value: "node", label: "Node.js" },
            { value: "go", label: "Go" }
          ]
        }
      ]}
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Select
                                    label="Stack"
                                    data={groupedData}
                                    withinPortal={false}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use value and onChange when selection state belongs to external form or app logic."
                    >
                        <Documentation.Showcase
                            code={`import { Select } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [value, setValue] = useState<string | null>("react");

  return (
    <Select
      value={value}
      onChange={setValue}
      data={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" }
      ]}
    />
  );
}`}
                        >
                            <ControlledSelectShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Select."
                    >
                        <Documentation.ClassesInspector
                            Component={SelectSlotsShowcase}
                            slots={[
                                "root",
                                "trigger",
                                "triggerInput",
                                "triggerIcon",
                                "dropdown",
                                "search",
                                "searchInput",
                                "options",
                                "group",
                                "groupLabel",
                                "item",
                                "itemLabel",
                                "itemCheck",
                                "empty"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="select-props"
                        title="Select Props"
                        description="The props for the Select component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="data"
                                type="SelectData[]"
                                description="Data-driven options list. Supports flat items and grouped items."
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Compound API children. If provided, data rendering is skipped."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Field label rendered above the trigger."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered under the label."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message rendered under the field."
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string | null"
                                description="Controlled selected value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string | null"
                                description="Initial selected value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string | null) => void"
                                description="Called when selected value changes."
                            />
                            <Documentation.Props.Content
                                name="searchable"
                                type="boolean"
                                default="false"
                                description="Shows a search input inside dropdown."
                            />
                            <Documentation.Props.Content
                                name="searchValue"
                                type="string"
                                description="Controlled search query."
                            />
                            <Documentation.Props.Content
                                name="onSearchChange"
                                type="(value: string) => void"
                                description="Called when search query changes."
                            />
                            <Documentation.Props.Content
                                name="placeholder"
                                type="string"
                                default='"Select option"'
                                description="Placeholder shown in trigger when no value is selected."
                            />
                            <Documentation.Props.Content
                                name="searchPlaceholder"
                                type="string"
                                default='"Search..."'
                                description="Placeholder for searchable input."
                            />
                            <Documentation.Props.Content
                                name="nothingFound"
                                type="ReactNode"
                                default='"No options"'
                                description="Content shown when search returns no matches."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls trigger and search input sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls trigger and dropdown corner radius."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls trigger and search input visual style."
                            />
                            <Documentation.Props.Content
                                name="positioning"
                                type="SelectPositioning"
                                default='{ placement: "bottom-start", offset: 4 }'
                                description="Floating placement and offset configuration."
                            />
                            <Documentation.Props.Content
                                name="middlewares"
                                type="SelectMiddlewares"
                                default='{ flip: true, shift: true }'
                                description="Floating middleware configuration."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables trigger and selection interactions."
                            />
                            <Documentation.Props.Content
                                name="withinPortal"
                                type="boolean"
                                default="true"
                                description="Renders dropdown in a portal."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="SelectClassNames"
                                description="Slot-level class overrides for trigger, dropdown, search, groups, items, and empty state."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
