import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    NumberInput,
    type NumberInputClassNames,
    type NumberInputControlsPosition,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/number-input/")({
    component: RouteComponent
});

type NumberInputVariant = "default" | "filled" | "outline";

const NumberInputPlayground = createPlayground(
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
        controlsPosition: {
            type: "segmented",
            label: "Controls",
            options: ["right", "left", "none"] as const,
            default: "right"
        },
        step: {
            type: "number",
            label: "Step",
            min: 0.1,
            max: 10,
            step: 0.1,
            default: 1
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
            min: -100,
            max: 200,
            step: 1,
            default: 10
        },
        precision: {
            type: "number",
            label: "Precision",
            min: 0,
            max: 4,
            step: 1,
            default: 0
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
                imports: [`import { NumberInput } from "@refraktor/core";`],
                component: "NumberInput",
                values: {
                    label: "Quantity",
                    description: "Use arrows, keyboard, or wheel while focused.",
                    defaultValue: 4,
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    controlsPosition: props.controlsPosition,
                    step: props.step,
                    min: props.min,
                    max: props.max,
                    precision: props.precision,
                    disabled: props.disabled
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    controlsPosition: defaults.controlsPosition,
                    step: defaults.step,
                    min: defaults.min,
                    max: defaults.max,
                    precision: defaults.precision,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface NumberInputSlotsShowcaseProps {
    classNames?: NumberInputClassNames;
}

function NumberInputSlotsShowcase({ classNames }: NumberInputSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <NumberInput
                label="Seats"
                min={1}
                max={20}
                defaultValue={4}
                controlsPosition="right"
                classNames={classNames}
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="NumberInput"
                description="Capture numeric values with built-in steppers, min/max clamping, precision control, and keyboard-friendly interactions."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/number-input/number-input.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <NumberInputPlayground.Wrapper>
                            <NumberInputPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    controlsPosition,
                                    step,
                                    min,
                                    max,
                                    precision,
                                    disabled
                                }) => (
                                    <div className="w-full max-w-md">
                                        <NumberInput
                                            key={`${variant}-${size}-${radius}-${controlsPosition}-${step}-${min}-${max}-${precision}-${disabled}`}
                                            label="Quantity"
                                            description="Use arrows, keyboard, or wheel while focused."
                                            defaultValue={4}
                                            variant={variant as NumberInputVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            controlsPosition={
                                                controlsPosition as NumberInputControlsPosition
                                            }
                                            step={step}
                                            min={min}
                                            max={max}
                                            precision={precision}
                                            disabled={disabled}
                                        />
                                    </div>
                                )}
                            </NumberInputPlayground.Preview>

                            <NumberInputPlayground.Controls />

                            <NumberInputPlayground.Code />
                        </NumberInputPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controls-position"
                        title="Controls position"
                        description="Place increment and decrement controls on the left, right, or hide them entirely."
                    >
                        <Documentation.Showcase
                            code={`import { NumberInput } from "@refraktor/core";

export function Demo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <NumberInput label="Left" controlsPosition="left" defaultValue={8} />
      <NumberInput label="Right" controlsPosition="right" defaultValue={8} />
      <NumberInput label="None" controlsPosition="none" defaultValue={8} />
    </div>
  );
}`}
                        >
                            <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
                                <NumberInput
                                    label="Left"
                                    controlsPosition="left"
                                    defaultValue={8}
                                />
                                <NumberInput
                                    label="Right"
                                    controlsPosition="right"
                                    defaultValue={8}
                                />
                                <NumberInput
                                    label="None"
                                    controlsPosition="none"
                                    defaultValue={8}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="range-and-precision"
                        title="Range and precision"
                        description="Use min, max, step, and precision to keep values within valid bounds and formatting rules."
                    >
                        <Documentation.Showcase
                            code={`import { NumberInput } from "@refraktor/core";

export function Demo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <NumberInput
        label="Discount"
        min={0}
        max={100}
        step={0.5}
        precision={1}
        defaultValue={12.5}
      />
      <NumberInput
        label="Temperature"
        min={-20}
        max={40}
        step={0.25}
        precision={2}
        defaultValue={21.5}
      />
    </div>
  );
}`}
                        >
                            <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                                <NumberInput
                                    label="Discount"
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    precision={1}
                                    defaultValue={12.5}
                                />
                                <NumberInput
                                    label="Temperature"
                                    min={-20}
                                    max={40}
                                    step={0.25}
                                    precision={2}
                                    defaultValue={21.5}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="validation-feedback"
                        title="Validation feedback"
                        description="Use label, description, error, and required helpers to communicate constraints clearly."
                    >
                        <Documentation.Showcase
                            code={`import { NumberInput } from "@refraktor/core";

export function Demo() {
  return (
    <NumberInput
      label="Attendees"
      description="Minimum 1 and maximum 10 people."
      error="Please enter a value between 1 and 10"
      required
      withAsterisk
      min={1}
      max={10}
      defaultValue={0}
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <NumberInput
                                    label="Attendees"
                                    description="Minimum 1 and maximum 10 people."
                                    error="Please enter a value between 1 and 10"
                                    required
                                    withAsterisk
                                    min={1}
                                    max={10}
                                    defaultValue={0}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of NumberInput."
                    >
                        <Documentation.ClassesInspector
                            Component={NumberInputSlotsShowcase}
                            slots={[
                                "root",
                                "leftSection",
                                "rightSection",
                                "controls",
                                "increment",
                                "decrement"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="number-input-props"
                        title="NumberInput Props"
                        description="Core props for NumberInput. The component also supports Input wrapper and field props unless overridden below."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="value"
                                type="string | number"
                                description="Controlled numeric value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string | number"
                                default="0"
                                description="Initial value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string | number) => void"
                                description="Called when the input value changes."
                            />
                            <Documentation.Props.Content
                                name="min"
                                type="number"
                                description="Minimum allowed value."
                            />
                            <Documentation.Props.Content
                                name="max"
                                type="number"
                                description="Maximum allowed value."
                            />
                            <Documentation.Props.Content
                                name="step"
                                type="number"
                                default="1"
                                description="Amount added or subtracted per increment action."
                            />
                            <Documentation.Props.Content
                                name="precision"
                                type="number"
                                description="Number of decimal places kept when formatting values."
                            />
                            <Documentation.Props.Content
                                name="controlsPosition"
                                type='"left" | "right" | "none"'
                                default='"right"'
                                description="Placement of increment/decrement controls."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label content rendered above the field."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text shown under the label."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message shown under the field."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls the input visual style."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls height, spacing, and text sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the field container."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables typing and step controls."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the field root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="NumberInputClassNames"
                                description="Slot-level class overrides for root, leftSection, rightSection, controls, increment, and decrement."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
