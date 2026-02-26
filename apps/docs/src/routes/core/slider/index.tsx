import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Slider,
    type RefraktorRadius,
    type RefraktorSize,
    type SliderClassNames
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/slider/")({
    component: RouteComponent
});

const marksData = [
    { value: 0, label: "0" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 75, label: "75" },
    { value: 100, label: "100" }
];

function normalizeRange(min: number, max: number) {
    if (min === max) {
        return { min, max: max + 1 };
    }

    return min < max ? { min, max } : { min: max, max: min };
}

const SliderPlayground = createPlayground(
    {
        value: {
            type: "number",
            label: "Value",
            min: 0,
            max: 100,
            step: 1,
            default: 45
        },
        min: {
            type: "number",
            label: "Min",
            min: -50,
            max: 90,
            step: 1,
            default: 0
        },
        max: {
            type: "number",
            label: "Max",
            min: 10,
            max: 200,
            step: 1,
            default: 100
        },
        step: {
            type: "number",
            label: "Step",
            min: 0.1,
            max: 20,
            step: 0.1,
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
            default: "full"
        },
        withMarks: {
            type: "switch",
            label: "Marks",
            default: false
        },
        showLabelOnHover: {
            type: "switch",
            label: "Label On Hover",
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
            const range = normalizeRange(props.min, props.max);

            return createSnippet({
                imports: [`import { Slider } from "@refraktor/core";`],
                component: "Slider",
                values: {
                    value: props.value,
                    min: range.min,
                    max: range.max,
                    step: props.step,
                    size: props.size,
                    radius: props.radius,
                    marks: props.withMarks ? marksData : undefined,
                    showLabelOnHover: props.showLabelOnHover,
                    label: props.showLabelOnHover ? "Value" : undefined,
                    disabled: props.disabled
                },
                defaults: {
                    min: defaults.min,
                    max: defaults.max,
                    step: defaults.step,
                    size: defaults.size,
                    radius: defaults.radius,
                    showLabelOnHover: defaults.showLabelOnHover,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface SliderSlotsShowcaseProps {
    classNames?: SliderClassNames;
}

function SliderSlotsShowcase({ classNames }: SliderSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-xl pt-6">
            <Slider
                defaultValue={55}
                showLabelOnHover
                label="Value"
                marks={marksData}
                classNames={classNames}
            />
        </div>
    );
}

function ControlledSliderShowcase() {
    const [value, setValue] = useState(35);
    const [committed, setCommitted] = useState(35);

    return (
        <div className="w-full max-w-xl space-y-3 pt-4">
            <Slider
                value={value}
                onChange={setValue}
                onChangeEnd={setCommitted}
                step={5}
            />

            <p className="text-sm text-dark-200">
                Value: {value} | Last committed: {committed}
            </p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Slider"
                description="Select numeric values from a draggable track with optional marks, hover labels, and configurable stepping behavior."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/slider/slider.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <SliderPlayground.Wrapper>
                            <SliderPlayground.Preview>
                                {({
                                    value,
                                    min,
                                    max,
                                    step,
                                    size,
                                    radius,
                                    withMarks,
                                    showLabelOnHover,
                                    disabled
                                }) => {
                                    const range = normalizeRange(min, max);

                                    return (
                                        <div className="w-full max-w-2xl pt-4">
                                            <Slider
                                                key={`${value}-${range.min}-${range.max}-${step}-${size}-${radius}-${withMarks}-${showLabelOnHover}-${disabled}`}
                                                value={value}
                                                min={range.min}
                                                max={range.max}
                                                step={step}
                                                size={size as RefraktorSize}
                                                radius={radius as RefraktorRadius}
                                                marks={withMarks ? marksData : undefined}
                                                showLabelOnHover={showLabelOnHover}
                                                label={showLabelOnHover ? "Value" : undefined}
                                                disabled={disabled}
                                            />
                                        </div>
                                    );
                                }}
                            </SliderPlayground.Preview>

                            <SliderPlayground.Controls />

                            <SliderPlayground.Code />
                        </SliderPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="marks"
                        title="Marks"
                        description="Use marks to communicate key value checkpoints directly on the track."
                    >
                        <Documentation.Showcase
                            code={`import { Slider } from "@refraktor/core";

export function Demo() {
  return (
    <Slider
      defaultValue={40}
      marks={[
        { value: 0, label: "0" },
        { value: 25, label: "25" },
        { value: 50, label: "50" },
        { value: 75, label: "75" },
        { value: 100, label: "100" }
      ]}
    />
  );
}`}
                        >
                            <div className="w-full max-w-2xl pt-4">
                                <Slider defaultValue={40} marks={marksData} />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use onChange and onChangeEnd when slider values drive live state and committed updates separately."
                    >
                        <Documentation.Showcase
                            code={`import { Slider } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [value, setValue] = useState(35);
  const [committed, setCommitted] = useState(35);

  return (
    <>
      <Slider
        value={value}
        onChange={setValue}
        onChangeEnd={setCommitted}
        step={5}
      />
      <p>Value: {value} | Last committed: {committed}</p>
    </>
  );
}`}
                        >
                            <ControlledSliderShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Slider."
                    >
                        <Documentation.ClassesInspector
                            Component={SliderSlotsShowcase}
                            slots={[
                                "root",
                                "track",
                                "bar",
                                "thumb",
                                "label",
                                "markWrapper",
                                "mark",
                                "markLabel"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="slider-props"
                        title="Slider Props"
                        description="The props for the Slider component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="value"
                                type="number"
                                description="Controlled slider value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="number"
                                description="Initial value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: number) => void"
                                description="Called whenever value changes while dragging or clicking."
                            />
                            <Documentation.Props.Content
                                name="onChangeEnd"
                                type="(value: number) => void"
                                description="Called when pointer interaction ends."
                            />
                            <Documentation.Props.Content
                                name="min"
                                type="number"
                                default="0"
                                description="Minimum allowed value."
                            />
                            <Documentation.Props.Content
                                name="max"
                                type="number"
                                default="100"
                                description="Maximum allowed value."
                            />
                            <Documentation.Props.Content
                                name="step"
                                type="number"
                                default="1"
                                description="Value increment for drag and click interactions."
                            />
                            <Documentation.Props.Content
                                name="precision"
                                type="number"
                                description="Decimal precision used when step includes fractional values."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls track and thumb sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls border radius for track and thumb."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables pointer and keyboard interaction."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Content shown in the thumb tooltip."
                            />
                            <Documentation.Props.Content
                                name="showLabelOnHover"
                                type="boolean"
                                default="false"
                                description="Shows label when thumb is hovered or dragged."
                            />
                            <Documentation.Props.Content
                                name="marks"
                                type="SliderMark[]"
                                description="Track marks with optional labels."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="SliderClassNames"
                                description="Slot-level class overrides for root, track, bar, thumb, label, and mark elements."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
