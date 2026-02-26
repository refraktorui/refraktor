import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    ProgressCircle,
    type ProgressCircleClassNames,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/progress-circle/")({
    component: RouteComponent
});

const ProgressCirclePlayground = createPlayground(
    {
        value: {
            type: "number",
            label: "Value",
            min: -50,
            max: 150,
            step: 1,
            default: 65
        },
        min: {
            type: "number",
            label: "Min",
            min: -100,
            max: 100,
            step: 1,
            default: 0
        },
        max: {
            type: "number",
            label: "Max",
            min: 0,
            max: 200,
            step: 1,
            default: 100
        },
        size: {
            type: "select",
            label: "Size",
            options: ["xs", "sm", "md", "lg", "xl"] as const,
            default: "md"
        },
        animated: {
            type: "switch",
            label: "Animated",
            default: true
        },
        indeterminate: {
            type: "switch",
            label: "Indeterminate",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            return createSnippet({
                imports: [`import { ProgressCircle } from "@refraktor/core";`],
                component: "ProgressCircle",
                values: {
                    value: props.value,
                    min: props.min,
                    max: props.max,
                    size: props.size,
                    animated: props.animated,
                    indeterminate: props.indeterminate,
                    "aria-label": "Upload progress"
                },
                defaults: {
                    min: defaults.min,
                    max: defaults.max,
                    size: defaults.size,
                    animated: defaults.animated,
                    indeterminate: defaults.indeterminate
                }
            });
        }
    }
);

interface ProgressCircleSlotsShowcaseProps {
    classNames?: ProgressCircleClassNames;
}

function ProgressCircleSlotsShowcase({
    classNames
}: ProgressCircleSlotsShowcaseProps) {
    return (
        <ProgressCircle
            value={68}
            size="xl"
            classNames={classNames}
            aria-label="Preview"
        />
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="ProgressCircle"
                description="Display determinate and indeterminate circular progress with scalable sizes and smooth stroke transitions."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/progress-circle/progress-circle.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ProgressCirclePlayground.Wrapper>
                            <ProgressCirclePlayground.Preview>
                                {({
                                    value,
                                    min,
                                    max,
                                    size,
                                    animated,
                                    indeterminate
                                }) => (
                                    <ProgressCircle
                                        key={`${value}-${min}-${max}-${size}-${animated}-${indeterminate}`}
                                        value={value}
                                        min={min}
                                        max={max}
                                        size={size as RefraktorSize}
                                        animated={animated}
                                        indeterminate={indeterminate}
                                        aria-label="Upload progress"
                                    />
                                )}
                            </ProgressCirclePlayground.Preview>

                            <ProgressCirclePlayground.Controls />

                            <ProgressCirclePlayground.Code />
                        </ProgressCirclePlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sizes"
                        title="Sizes"
                        description="Pick the right visual weight from compact inline indicators to larger status callouts."
                    >
                        <Documentation.Showcase
                            code={`import { ProgressCircle } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ProgressCircle value={55} size="xs" aria-label="XS" />
      <ProgressCircle value={55} size="sm" aria-label="SM" />
      <ProgressCircle value={55} size="md" aria-label="MD" />
      <ProgressCircle value={55} size="lg" aria-label="LG" />
      <ProgressCircle value={55} size="xl" aria-label="XL" />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-4">
                                <ProgressCircle value={55} size="xs" aria-label="XS" />
                                <ProgressCircle value={55} size="sm" aria-label="SM" />
                                <ProgressCircle value={55} size="md" aria-label="MD" />
                                <ProgressCircle value={55} size="lg" aria-label="LG" />
                                <ProgressCircle value={55} size="xl" aria-label="XL" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-range"
                        title="Custom range"
                        description="Use min and max to represent percentages from alternate numeric ranges."
                    >
                        <Documentation.Showcase
                            code={`import { ProgressCircle } from "@refraktor/core";

export function Demo() {
  return (
    <ProgressCircle
      min={40}
      max={140}
      value={90}
      size="xl"
      aria-label="Custom range progress"
    />
  );
}`}
                        >
                            <div className="space-y-2">
                                <ProgressCircle
                                    min={40}
                                    max={140}
                                    value={90}
                                    size="xl"
                                    aria-label="Custom range progress"
                                />
                                <p className="text-sm text-dark-200">
                                    Value 90 in a 40-140 range resolves to 50%
                                    arc fill.
                                </p>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="indeterminate"
                        title="Indeterminate"
                        description="Use indeterminate mode for ongoing operations when completion amount is unknown."
                    >
                        <Documentation.Showcase
                            code={`import { ProgressCircle } from "@refraktor/core";

export function Demo() {
  return <ProgressCircle indeterminate size="lg" aria-label="Loading" />;
}`}
                        >
                            <ProgressCircle
                                indeterminate
                                size="lg"
                                aria-label="Loading"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of ProgressCircle."
                    >
                        <Documentation.ClassesInspector
                            Component={ProgressCircleSlotsShowcase}
                            slots={["root", "svg", "track", "bar"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="progress-circle-props"
                        title="ProgressCircle Props"
                        description="The props for the ProgressCircle component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="value"
                                type="number"
                                default="0"
                                description="Current progress value."
                            />
                            <Documentation.Props.Content
                                name="min"
                                type="number"
                                default="0"
                                description="Lower bound of the progress range."
                            />
                            <Documentation.Props.Content
                                name="max"
                                type="number"
                                default="100"
                                description="Upper bound of the progress range."
                            />
                            <Documentation.Props.Content
                                name="indeterminate"
                                type="boolean"
                                default="false"
                                description="Displays a spinning indeterminate arc without value semantics."
                            />
                            <Documentation.Props.Content
                                name="animated"
                                type="boolean"
                                default="true"
                                description="Animates stroke-dashoffset changes in determinate mode."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls overall circle diameter and stroke width."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ProgressCircleClassNames"
                                description="Slot-level class overrides for root, svg, track, and bar."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
