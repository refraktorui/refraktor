import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    SegmentedControl,
    type RefraktorRadius,
    type RefraktorSize,
    type SegmentedControlClassNames
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/segmented-control/")({
    component: RouteComponent
});

const dataSnippet = `[
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
]`;

const SegmentedControlPlayground = createPlayground(
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
        fullWidth: {
            type: "switch",
            label: "Full Width",
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
            const rootProps = [
                `data={${dataSnippet}}`,
                'defaultValue="weekly"',
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.fullWidth ? "fullWidth" : null,
                props.disabled ? "disabled" : null
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [`import { SegmentedControl } from "@refraktor/core";`],
                jsx: `<SegmentedControl\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n/>`
            });
        }
    }
);

interface SegmentedControlSlotsShowcaseProps {
    classNames?: SegmentedControlClassNames;
}

function SegmentedControlSlotsShowcase({
    classNames
}: SegmentedControlSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-xl">
            <SegmentedControl
                data={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" }
                ]}
                defaultValue="weekly"
                classNames={classNames}
            />
        </div>
    );
}

function ControlledSegmentedControlShowcase() {
    const [value, setValue] = useState("weekly");

    return (
        <div className="w-full max-w-xl space-y-3">
            <SegmentedControl
                data={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" }
                ]}
                value={value}
                onChange={setValue}
            />

            <p className="text-sm text-dark-200">Selected: {value}</p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="SegmentedControl"
                description="Switch between related views quickly using compact radio-style segments with keyboard navigation and full-width layouts."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/segmented-control/segmented-control.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <SegmentedControlPlayground.Wrapper>
                            <SegmentedControlPlayground.Preview>
                                {({ size, radius, fullWidth, disabled }) => (
                                    <div className="w-full max-w-xl">
                                        <SegmentedControl
                                            key={`${size}-${radius}-${fullWidth}-${disabled}`}
                                            data={[
                                                {
                                                    value: "daily",
                                                    label: "Daily"
                                                },
                                                {
                                                    value: "weekly",
                                                    label: "Weekly"
                                                },
                                                {
                                                    value: "monthly",
                                                    label: "Monthly"
                                                }
                                            ]}
                                            defaultValue="weekly"
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            fullWidth={fullWidth}
                                            disabled={disabled}
                                        />
                                    </div>
                                )}
                            </SegmentedControlPlayground.Preview>

                            <SegmentedControlPlayground.Controls />

                            <SegmentedControlPlayground.Code />
                        </SegmentedControlPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use value and onChange when the selected segment drives external UI or data-fetching state."
                    >
                        <Documentation.Showcase
                            code={`import { SegmentedControl } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [value, setValue] = useState("weekly");

  return (
    <SegmentedControl
      data={[
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" }
      ]}
      value={value}
      onChange={setValue}
    />
  );
}`}
                        >
                            <ControlledSegmentedControlShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="icons-and-disabled"
                        title="Icons and disabled options"
                        description="Attach icons to improve scanability and disable unavailable options without breaking keyboard flow."
                    >
                        <Documentation.Showcase
                            code={`import { SegmentedControl } from "@refraktor/core";

export function Demo() {
  return (
    <SegmentedControl
      defaultValue="react"
      data={[
        { value: "react", label: "React", icon: <span>R</span> },
        { value: "vue", label: "Vue", icon: <span>V</span>, disabled: true },
        { value: "svelte", label: "Svelte", icon: <span>S</span> }
      ]}
    />
  );
}`}
                        >
                            <SegmentedControl
                                defaultValue="react"
                                data={[
                                    {
                                        value: "react",
                                        label: "React",
                                        icon: <span aria-hidden>R</span>
                                    },
                                    {
                                        value: "vue",
                                        label: "Vue",
                                        icon: <span aria-hidden>V</span>,
                                        disabled: true
                                    },
                                    {
                                        value: "svelte",
                                        label: "Svelte",
                                        icon: <span aria-hidden>S</span>
                                    }
                                ]}
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of SegmentedControl."
                    >
                        <Documentation.ClassesInspector
                            Component={SegmentedControlSlotsShowcase}
                            slots={["root", "control", "label"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="segmented-control-props"
                        title="SegmentedControl Props"
                        description="The props for the SegmentedControl component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="data"
                                type="SegmentedControlItem[]"
                                description="List of segment items with value and label, plus optional icon and disabled state."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Controlled selected value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string"
                                description="Initial selected value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string) => void"
                                description="Called when selected value changes."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls segment sizing and typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius for root and segment controls."
                            />
                            <Documentation.Props.Content
                                name="fullWidth"
                                type="boolean"
                                default="false"
                                description="Makes each segment grow to fill available width."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables the entire segmented control."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Sets hidden input name for form submissions."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="SegmentedControlClassNames"
                                description="Slot-level class overrides for root, control, and label."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
