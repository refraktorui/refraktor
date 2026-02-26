import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Switch,
    type RefraktorRadius,
    type RefraktorSize,
    type SwitchClassNames
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/switch/")({
    component: RouteComponent
});

type SwitchLabelPosition = "left" | "right";

const SwitchPlayground = createPlayground(
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
            default: "full"
        },
        labelPosition: {
            type: "segmented",
            label: "Label Position",
            options: ["right", "left"] as const,
            default: "right"
        },
        defaultChecked: {
            type: "switch",
            label: "Checked",
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
                imports: [`import { Switch } from "@refraktor/core";`],
                component: "Switch",
                values: {
                    label: "Enable notifications",
                    description: "Get updates when deployments complete.",
                    size: props.size,
                    radius: props.radius,
                    labelPosition: props.labelPosition,
                    defaultChecked: props.defaultChecked,
                    disabled: props.disabled
                },
                defaults: {
                    size: defaults.size,
                    radius: defaults.radius,
                    labelPosition: defaults.labelPosition,
                    defaultChecked: defaults.defaultChecked,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface SwitchSlotsShowcaseProps {
    classNames?: SwitchClassNames;
}

function SwitchSlotsShowcase({ classNames }: SwitchSlotsShowcaseProps) {
    return (
        <Switch
            label="Email alerts"
            description="Receive release and incident updates."
            defaultChecked
            classNames={classNames}
        />
    );
}

function ControlledSwitchShowcase() {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="w-full max-w-xl space-y-3">
            <Switch
                label="Public profile"
                checked={enabled}
                onChange={(event) => setEnabled(event.currentTarget.checked)}
            />
            <p className="text-sm text-dark-200">
                Profile is {enabled ? "public" : "private"}
            </p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Switch"
                description="Toggle binary settings with clear on/off affordance, optional labels, and support for controlled form state."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/switch/switch.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <SwitchPlayground.Wrapper>
                            <SwitchPlayground.Preview>
                                {({
                                    size,
                                    radius,
                                    labelPosition,
                                    defaultChecked,
                                    disabled
                                }) => (
                                    <Switch
                                        key={`${size}-${radius}-${labelPosition}-${defaultChecked}-${disabled}`}
                                        label="Enable notifications"
                                        description="Get updates when deployments complete."
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        labelPosition={
                                            labelPosition as SwitchLabelPosition
                                        }
                                        defaultChecked={defaultChecked}
                                        disabled={disabled}
                                    />
                                )}
                            </SwitchPlayground.Preview>

                            <SwitchPlayground.Controls />

                            <SwitchPlayground.Code />
                        </SwitchPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use checked and onChange when switch state must sync with external app or form state."
                    >
                        <Documentation.Showcase
                            code={`import { Switch } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      label="Public profile"
      checked={enabled}
      onChange={(event) => setEnabled(event.currentTarget.checked)}
    />
  );
}`}
                        >
                            <ControlledSwitchShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="label-position"
                        title="Label position"
                        description="Move labels left or right depending on layout density and visual rhythm."
                    >
                        <Documentation.Showcase
                            code={`import { Switch } from "@refraktor/core";

export function Demo() {
  return (
    <div className="space-y-3">
      <Switch label="Label right" labelPosition="right" defaultChecked />
      <Switch label="Label left" labelPosition="left" defaultChecked />
    </div>
  );
}`}
                        >
                            <div className="space-y-3">
                                <Switch
                                    label="Label right"
                                    labelPosition="right"
                                    defaultChecked
                                />
                                <Switch
                                    label="Label left"
                                    labelPosition="left"
                                    defaultChecked
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="description-and-error"
                        title="Description and error"
                        description="Provide supporting context and validation feedback for settings that require user confirmation."
                    >
                        <Documentation.Showcase
                            code={`import { Switch } from "@refraktor/core";

export function Demo() {
  return (
    <Switch
      label="Terms accepted"
      description="Required before continuing."
      error="Please enable this option"
    />
  );
}`}
                        >
                            <Switch
                                label="Terms accepted"
                                description="Required before continuing."
                                error="Please enable this option"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Switch."
                    >
                        <Documentation.ClassesInspector
                            Component={SwitchSlotsShowcase}
                            slots={["root", "input", "track", "thumb", "label"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="switch-props"
                        title="Switch Props"
                        description="The props for the Switch component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="checked"
                                type="boolean"
                                description="Controlled switch state."
                            />
                            <Documentation.Props.Content
                                name="defaultChecked"
                                type="boolean"
                                default="false"
                                description="Initial checked state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(event: React.ChangeEvent<HTMLInputElement>) => void"
                                description="Called when checked state changes."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls track, thumb, and label sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls track and thumb radius."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Main switch label content."
                            />
                            <Documentation.Props.Content
                                name="labelPosition"
                                type='"left" | "right"'
                                default='"right"'
                                description="Places label before or after the switch track."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered under the control."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message rendered under the control."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables interaction for the switch."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="SwitchClassNames"
                                description="Slot-level class overrides for root, input, track, thumb, and label."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
