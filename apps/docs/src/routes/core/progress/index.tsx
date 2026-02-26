import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Progress,
    type ProgressClassNames,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/progress/")({
    component: RouteComponent
});

const ProgressPlayground = createPlayground(
    {
        value: {
            type: "number",
            label: "Value",
            min: -50,
            max: 150,
            step: 1,
            default: 45
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
            default: "full"
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
                imports: [`import { Progress } from "@refraktor/core";`],
                component: "Progress",
                values: {
                    value: props.value,
                    min: props.min,
                    max: props.max,
                    size: props.size,
                    radius: props.radius,
                    animated: props.animated,
                    indeterminate: props.indeterminate,
                    "aria-label": "Upload progress"
                },
                defaults: {
                    min: defaults.min,
                    max: defaults.max,
                    size: defaults.size,
                    radius: defaults.radius,
                    animated: defaults.animated,
                    indeterminate: defaults.indeterminate
                }
            });
        }
    }
);

interface ProgressSlotsShowcaseProps {
    classNames?: ProgressClassNames;
}

function ProgressSlotsShowcase({ classNames }: ProgressSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-xl">
            <Progress value={62} classNames={classNames} aria-label="Preview" />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Progress"
                description="Display determinate and indeterminate linear progress states with flexible sizing, radius, and range controls."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/progress/progress.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ProgressPlayground.Wrapper>
                            <ProgressPlayground.Preview>
                                {({
                                    value,
                                    min,
                                    max,
                                    size,
                                    radius,
                                    animated,
                                    indeterminate
                                }) => (
                                    <div className="w-full max-w-2xl">
                                        <Progress
                                            key={`${value}-${min}-${max}-${size}-${radius}-${animated}-${indeterminate}`}
                                            value={value}
                                            min={min}
                                            max={max}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            animated={animated}
                                            indeterminate={indeterminate}
                                            aria-label="Upload progress"
                                        />
                                    </div>
                                )}
                            </ProgressPlayground.Preview>

                            <ProgressPlayground.Controls />

                            <ProgressPlayground.Code />
                        </ProgressPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sizes"
                        title="Sizes"
                        description="Use compact sizes for dense layouts and larger tracks for primary loading states."
                    >
                        <Documentation.Showcase
                            code={`import { Progress } from "@refraktor/core";

export function Demo() {
  return (
    <div className="space-y-3">
      <Progress value={35} size="xs" aria-label="XS" />
      <Progress value={45} size="sm" aria-label="SM" />
      <Progress value={55} size="md" aria-label="MD" />
      <Progress value={65} size="lg" aria-label="LG" />
      <Progress value={75} size="xl" aria-label="XL" />
    </div>
  );
}`}
                        >
                            <div className="w-full max-w-2xl space-y-3">
                                <Progress value={35} size="xs" aria-label="XS" />
                                <Progress value={45} size="sm" aria-label="SM" />
                                <Progress value={55} size="md" aria-label="MD" />
                                <Progress value={65} size="lg" aria-label="LG" />
                                <Progress value={75} size="xl" aria-label="XL" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-range"
                        title="Custom range"
                        description="Set min and max to map progress to non-0-100 domains such as scores, quotas, or task counts."
                    >
                        <Documentation.Showcase
                            code={`import { Progress } from "@refraktor/core";

export function Demo() {
  return (
    <Progress
      min={20}
      max={80}
      value={50}
      aria-label="Custom range progress"
    />
  );
}`}
                        >
                            <div className="w-full max-w-2xl space-y-2">
                                <Progress
                                    min={20}
                                    max={80}
                                    value={50}
                                    aria-label="Custom range progress"
                                />
                                <p className="text-sm text-dark-200">
                                    Value 50 in a 20-80 range resolves to 50%
                                    fill.
                                </p>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="indeterminate"
                        title="Indeterminate"
                        description="Use indeterminate mode when total progress is unknown."
                    >
                        <Documentation.Showcase
                            code={`import { Progress } from "@refraktor/core";

export function Demo() {
  return <Progress indeterminate aria-label="Loading" />;
}`}
                        >
                            <div className="w-full max-w-2xl">
                                <Progress indeterminate aria-label="Loading" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Progress."
                    >
                        <Documentation.ClassesInspector
                            Component={ProgressSlotsShowcase}
                            slots={["root", "track", "bar"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="progress-props"
                        title="Progress Props"
                        description="The props for the Progress component."
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
                                description="Displays an ongoing loading animation without value semantics."
                            />
                            <Documentation.Props.Content
                                name="animated"
                                type="boolean"
                                default="true"
                                description="Animates bar width changes in determinate mode."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls the track height."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls border radius for track and bar."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ProgressClassNames"
                                description="Slot-level class overrides for root, track, and bar."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
