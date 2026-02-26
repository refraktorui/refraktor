import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Radio,
    type RadioClassNames,
    type RadioGroupClassNames,
    type RadioGroupOrientation,
    type RadioLabelPosition,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/radio/")({
    component: RouteComponent
});

const RadioPlayground = createPlayground(
    {
        orientation: {
            type: "segmented",
            label: "Orientation",
            options: ["vertical", "horizontal"] as const,
            default: "vertical"
        },
        labelPosition: {
            type: "segmented",
            label: "Label Position",
            options: ["right", "left"] as const,
            default: "right"
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
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                'defaultValue="react"',
                props.orientation !== defaults.orientation
                    ? `orientation="${props.orientation}"`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.disabled ? "disabled" : null
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [`import { Radio } from "@refraktor/core";`],
                jsx: `<Radio.Group
${rootProps.map((prop) => `  ${prop}`).join("\n")}
>
  <Radio
    value="react"
    label="React"
    labelPosition="${props.labelPosition}"
  />
  <Radio
    value="vue"
    label="Vue"
    labelPosition="${props.labelPosition}"
  />
  <Radio
    value="svelte"
    label="Svelte"
    labelPosition="${props.labelPosition}"
  />
</Radio.Group>`
            });
        }
    }
);

interface RadioSlotsShowcaseProps {
    classNames?: RadioClassNames;
}

function RadioSlotsShowcase({ classNames }: RadioSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <Radio
                label="Team updates"
                description="Get weekly product and release updates."
                error="Select one option"
                classNames={classNames}
            />
        </div>
    );
}

interface RadioGroupSlotsShowcaseProps {
    classNames?: RadioGroupClassNames;
}

function RadioGroupSlotsShowcase({ classNames }: RadioGroupSlotsShowcaseProps) {
    return (
        <Radio.Group defaultValue="react" classNames={classNames}>
            <Radio value="react" label="React" />
            <Radio value="vue" label="Vue" />
        </Radio.Group>
    );
}

function ControlledRadioShowcase() {
    const [framework, setFramework] = useState("react");

    return (
        <div className="w-full max-w-xl space-y-3">
            <Radio.Group
                value={framework}
                onChange={setFramework}
                orientation="horizontal"
            >
                <Radio value="react" label="React" />
                <Radio value="vue" label="Vue" />
                <Radio value="svelte" label="Svelte" />
            </Radio.Group>

            <p className="text-sm text-dark-200">Selected: {framework}</p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Radio"
                description="Capture a single selection from a list with standalone radios or coordinated Radio.Group state."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/radio/radio.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <RadioPlayground.Wrapper>
                            <RadioPlayground.Preview>
                                {({
                                    orientation,
                                    labelPosition,
                                    size,
                                    radius,
                                    disabled
                                }) => (
                                    <Radio.Group
                                        key={`${orientation}-${labelPosition}-${size}-${radius}-${disabled}`}
                                        defaultValue="react"
                                        orientation={
                                            orientation as RadioGroupOrientation
                                        }
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        disabled={disabled}
                                    >
                                        <Radio
                                            value="react"
                                            label="React"
                                            labelPosition={
                                                labelPosition as RadioLabelPosition
                                            }
                                        />
                                        <Radio
                                            value="vue"
                                            label="Vue"
                                            labelPosition={
                                                labelPosition as RadioLabelPosition
                                            }
                                        />
                                        <Radio
                                            value="svelte"
                                            label="Svelte"
                                            labelPosition={
                                                labelPosition as RadioLabelPosition
                                            }
                                        />
                                    </Radio.Group>
                                )}
                            </RadioPlayground.Preview>

                            <RadioPlayground.Controls />

                            <RadioPlayground.Code />
                        </RadioPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled-group"
                        title="Controlled group"
                        description="Use value and onChange to integrate radio selections with form or routing state."
                    >
                        <Documentation.Showcase
                            code={`import { Radio } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [framework, setFramework] = useState("react");

  return (
    <Radio.Group value={framework} onChange={setFramework}>
      <Radio value="react" label="React" />
      <Radio value="vue" label="Vue" />
      <Radio value="svelte" label="Svelte" />
    </Radio.Group>
  );
}`}
                        >
                            <ControlledRadioShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="description-and-error"
                        title="Description and error"
                        description="Use description and error props to add context and validation feedback around each radio option."
                    >
                        <Documentation.Showcase
                            code={`import { Radio } from "@refraktor/core";

export function Demo() {
  return (
    <Radio
      label="Email updates"
      description="Get monthly release highlights."
      error="Required for this setting"
    />
  );
}`}
                        >
                            <Radio
                                label="Email updates"
                                description="Get monthly release highlights."
                                error="Required for this setting"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="radio-classnames"
                        title="Radio classnames"
                        description="Hover slot names to highlight matching parts of Radio."
                    >
                        <Documentation.ClassesInspector
                            Component={RadioSlotsShowcase}
                            slots={[
                                "root",
                                "body",
                                "input",
                                "indicator",
                                "dot",
                                "label",
                                "description",
                                "error"
                            ]}
                        />
                    </Documentation.Section>

                    <Documentation.Section
                        id="radio-group-classnames"
                        title="Radio.Group classnames"
                        description="Radio.Group exposes root class customization for layout wrappers."
                    >
                        <Documentation.ClassesInspector
                            Component={RadioGroupSlotsShowcase}
                            slots={["root"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="radio-props"
                        title="Radio Props"
                        description="The props for the Radio component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="checked"
                                type="boolean"
                                description="Controlled checked state for standalone radio usage."
                            />
                            <Documentation.Props.Content
                                name="defaultChecked"
                                type="boolean"
                                default="false"
                                description="Initial checked state for uncontrolled standalone usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(event: React.ChangeEvent<HTMLInputElement>) => void"
                                description="Called when checked state changes."
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Value used when the radio is inside Radio.Group."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls indicator and label sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls the indicator border radius."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Radio label content."
                            />
                            <Documentation.Props.Content
                                name="labelPosition"
                                type='"left" | "right"'
                                default='"right"'
                                description="Places label before or after the indicator."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered below the radio row."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message rendered below the radio."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables interaction for the radio input."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="RadioClassNames"
                                description="Slot-level class overrides for root, body, input, indicator, dot, label, description, and error."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="radio-group-props"
                        title="Radio.Group Props"
                        description="The props for the Radio.Group component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Radio elements rendered inside the group."
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
                                description="Called when selected radio value changes."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Name shared across child radio inputs."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables all radios within the group."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                description="Shared size applied to child radios."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                description="Shared radius applied to child radios."
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"vertical" | "horizontal"'
                                default='"vertical"'
                                description="Layout direction for child radios."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the group root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="RadioGroupClassNames"
                                description="Slot-level class overrides for group root."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
