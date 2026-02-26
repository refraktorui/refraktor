import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Checkbox,
    type CheckboxClassNames,
    type CheckboxGroupClassNames,
    type CheckboxLabelPosition,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/checkbox/")({
    component: RouteComponent
});

const CheckboxPlayground = createPlayground(
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
            default: "sm"
        },
        labelPosition: {
            type: "segmented",
            label: "Label Position",
            options: ["left", "right"] as const,
            default: "right"
        },
        indeterminate: {
            type: "switch",
            label: "Indeterminate",
            default: false
        },
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        },
        description: {
            type: "switch",
            label: "Description",
            default: false
        },
        error: {
            type: "switch",
            label: "Error",
            default: false
        },
        label: {
            type: "text",
            label: "Label",
            default: "Accept terms"
        }
    },
    {
        code: (props, defaults) => {
            const label = props.label.trim() || "Accept terms";

            return createSnippet({
                imports: [`import { Checkbox } from "@refraktor/core";`],
                component: "Checkbox",
                values: {
                    size: props.size,
                    radius: props.radius,
                    labelPosition: props.labelPosition,
                    indeterminate: props.indeterminate ? true : undefined,
                    disabled: props.disabled ? true : undefined,
                    description: props.description
                        ? "Used for account preferences"
                        : undefined,
                    error: props.error
                        ? "You must accept this option"
                        : undefined,
                    label
                },
                defaults: {
                    size: defaults.size,
                    radius: defaults.radius,
                    labelPosition: defaults.labelPosition
                }
            });
        }
    }
);

interface CheckboxSlotsShowcaseProps {
    classNames?: CheckboxClassNames;
}

function CheckboxSlotsShowcase({ classNames }: CheckboxSlotsShowcaseProps) {
    return (
        <Checkbox
            defaultChecked
            label="Email updates"
            description="Receive product announcements and release notes."
            error="Required"
            classNames={classNames}
        />
    );
}

interface CheckboxGroupSlotsShowcaseProps {
    classNames?: CheckboxGroupClassNames;
}

function CheckboxGroupSlotsShowcase({
    classNames
}: CheckboxGroupSlotsShowcaseProps) {
    return (
        <Checkbox.Group
            orientation="horizontal"
            defaultValue={["react"]}
            classNames={{ root: classNames?.root }}
        >
            <Checkbox value="react" label="React" />
            <Checkbox value="vue" label="Vue" />
            <Checkbox value="svelte" label="Svelte" />
        </Checkbox.Group>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Checkbox"
                description="Capture boolean choices with support for labels, descriptions, indeterminate state, and grouped multi-select behavior."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/checkbox/checkbox.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <CheckboxPlayground.Wrapper>
                            <CheckboxPlayground.Preview>
                                {({
                                    size,
                                    radius,
                                    labelPosition,
                                    indeterminate,
                                    disabled,
                                    description,
                                    error,
                                    label
                                }) => (
                                    <Checkbox
                                        key={`${size}-${radius}-${labelPosition}-${indeterminate}-${disabled}-${description}-${error}-${label}`}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        labelPosition={
                                            labelPosition as CheckboxLabelPosition
                                        }
                                        indeterminate={indeterminate}
                                        disabled={disabled}
                                        description={
                                            description
                                                ? "Used for account preferences"
                                                : undefined
                                        }
                                        error={
                                            error
                                                ? "You must accept this option"
                                                : undefined
                                        }
                                        label={label.trim() || "Accept terms"}
                                    />
                                )}
                            </CheckboxPlayground.Preview>

                            <CheckboxPlayground.Controls />

                            <CheckboxPlayground.Code />
                        </CheckboxPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="label-position"
                        title="Label position"
                        description="Set labelPosition to left when the checkbox should align at the end of the row."
                    >
                        <Documentation.Showcase
                            code={`import { Checkbox } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox label="Right label" labelPosition="right" />
      <Checkbox label="Left label" labelPosition="left" />
    </div>
  );
}`}
                        >
                            <div className="flex flex-col gap-2">
                                <Checkbox
                                    label="Right label"
                                    labelPosition="right"
                                />
                                <Checkbox
                                    label="Left label"
                                    labelPosition="left"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="indeterminate"
                        title="Indeterminate"
                        description="Use indeterminate for partially selected parent states such as Select all controls."
                    >
                        <Documentation.Showcase
                            code={`import { Checkbox } from "@refraktor/core";

export function Demo() {
  return <Checkbox label="Select all" indeterminate />;
}`}
                        >
                            <Checkbox label="Select all" indeterminate />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="group"
                        title="Checkbox.Group"
                        description="Group related options and receive selected values as an array via onChange."
                    >
                        <Documentation.Showcase
                            code={`import { Checkbox } from "@refraktor/core";

export function Demo() {
  return (
    <Checkbox.Group
      name="frameworks"
      orientation="horizontal"
      defaultValue={["react"]}
    >
      <Checkbox value="react" label="React" />
      <Checkbox value="vue" label="Vue" />
      <Checkbox value="svelte" label="Svelte" />
    </Checkbox.Group>
  );
}`}
                        >
                            <Checkbox.Group
                                name="frameworks"
                                orientation="horizontal"
                                defaultValue={["react"]}
                            >
                                <Checkbox value="react" label="React" />
                                <Checkbox value="vue" label="Vue" />
                                <Checkbox value="svelte" label="Svelte" />
                            </Checkbox.Group>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="group-disabled"
                        title="Group disabled"
                        description="Set disabled on Checkbox.Group to disable every child checkbox consistently."
                    >
                        <Documentation.Showcase
                            code={`import { Checkbox } from "@refraktor/core";

export function Demo() {
  return (
    <Checkbox.Group disabled>
      <Checkbox value="email" label="Email notifications" />
      <Checkbox value="sms" label="SMS notifications" />
    </Checkbox.Group>
  );
}`}
                        >
                            <Checkbox.Group disabled>
                                <Checkbox
                                    value="email"
                                    label="Email notifications"
                                />
                                <Checkbox
                                    value="sms"
                                    label="SMS notifications"
                                />
                            </Checkbox.Group>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="checkbox-classnames"
                        title="Checkbox Classnames"
                        description="Hover slot names to highlight matching parts of Checkbox."
                    >
                        <Documentation.ClassesInspector
                            Component={CheckboxSlotsShowcase}
                            slots={[
                                "root",
                                "body",
                                "indicator",
                                "icon",
                                "label",
                                "description",
                                "error"
                            ]}
                        />
                    </Documentation.Section>

                    <Documentation.Section
                        id="checkbox-group-classnames"
                        title="Checkbox.Group Classnames"
                        description="Hover slot names to highlight matching parts of Checkbox.Group."
                    >
                        <Documentation.ClassesInspector
                            Component={CheckboxGroupSlotsShowcase}
                            slots={["root"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="checkbox-props"
                        title="Checkbox Props"
                        description="The props for the Checkbox component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="checked"
                                type="boolean"
                                description="Controlled checkbox state."
                            />
                            <Documentation.Props.Content
                                name="defaultChecked"
                                type="boolean"
                                description="Initial state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(event: React.ChangeEvent<HTMLInputElement>) => void"
                                description="Called when checked state changes."
                            />
                            <Documentation.Props.Content
                                name="indeterminate"
                                type="boolean"
                                description="Shows mixed selection state."
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Option value used by Checkbox.Group."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls indicator size and label typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"sm"'
                                description="Controls border radius on the indicator."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label displayed next to the checkbox."
                            />
                            <Documentation.Props.Content
                                name="labelPosition"
                                type='"left" | "right"'
                                default='"right"'
                                description="Places the label before or after the indicator."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text shown below the checkbox."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message shown below the description."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="CheckboxClassNames"
                                description="Slot-level class overrides for root, body, input, indicator, icon, label, description, and error."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="checkbox-group-props"
                        title="Checkbox.Group Props"
                        description="The props for Checkbox.Group."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Checkbox options rendered inside the group."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string[]"
                                description="Controlled selected values."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string[]"
                                description="Initial selected values for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string[]) => void"
                                description="Called when selected values change."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Name propagated to child checkbox inputs."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                description="Disables all checkboxes in the group."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                description="Shared checkbox size for child options."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                description="Shared checkbox radius for child options."
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"vertical" | "horizontal"'
                                default='"vertical"'
                                description="Layout direction for child checkboxes."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the group root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="CheckboxGroupClassNames"
                                description="Slot-level class overrides for the group root."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
