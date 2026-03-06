import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Textarea,
    type RefraktorRadius,
    type RefraktorSize,
    type TextareaFieldClassNames,
    type TextareaResize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/textarea/")({
    component: RouteComponent
});

type TextareaVariant = "default" | "filled" | "outline";

const TextareaPlayground = createPlayground(
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
        autosize: {
            type: "switch",
            label: "Autosize",
            default: false
        },
        minRows: {
            type: "number",
            label: "Min Rows",
            min: 1,
            max: 10,
            step: 1,
            default: 2
        },
        maxRows: {
            type: "number",
            label: "Max Rows",
            min: 2,
            max: 15,
            step: 1,
            default: 6
        },
        resize: {
            type: "segmented",
            label: "Resize",
            options: ["none", "vertical", "horizontal", "both"] as const,
            default: "vertical"
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
                imports: [`import { Textarea } from "@refraktor/core";`],
                component: "Textarea",
                values: {
                    label: "Notes",
                    placeholder: "Write your message...",
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    autosize: props.autosize,
                    minRows: props.minRows,
                    maxRows: props.autosize ? props.maxRows : undefined,
                    resize: props.resize,
                    disabled: props.disabled
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    autosize: defaults.autosize,
                    minRows: defaults.minRows,
                    resize: defaults.resize,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface TextareaSlotsShowcaseProps {
    classNames?: TextareaFieldClassNames;
}

function TextareaSlotsShowcase({ classNames }: TextareaSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-xl">
            <Textarea
                label="Summary"
                description="Share a brief update for your team."
                placeholder="Type your summary"
                minRows={3}
                classNames={classNames}
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Textarea"
                description="Capture multi-line text with the same validation and sizing patterns as Input, plus optional autosizing behavior."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/textarea/textarea.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <TextareaPlayground.Wrapper>
                            <TextareaPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    autosize,
                                    minRows,
                                    maxRows,
                                    resize,
                                    disabled
                                }) => (
                                    <div className="w-full max-w-xl">
                                        <Textarea
                                            key={`${variant}-${size}-${radius}-${autosize}-${minRows}-${maxRows}-${resize}-${disabled}`}
                                            label="Notes"
                                            placeholder="Write your message..."
                                            variant={variant as TextareaVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            autosize={autosize}
                                            minRows={minRows}
                                            maxRows={
                                                autosize ? maxRows : undefined
                                            }
                                            resize={resize as TextareaResize}
                                            disabled={disabled}
                                        />
                                    </div>
                                )}
                            </TextareaPlayground.Preview>

                            <TextareaPlayground.Controls />

                            <TextareaPlayground.Code />
                        </TextareaPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sections"
                        title="Left and right sections"
                        description="Use leftSection and rightSection for icons, shortcuts, or lightweight actions beside multi-line content."
                    >
                        <Documentation.Showcase
                            code={`import { Textarea } from "@refraktor/core";

export function Demo() {
  return (
    <Textarea
      label="Notes"
      placeholder="Write your message..."
      minRows={3}
      leftSection={<span aria-hidden>?</span>}
      rightSection={<span aria-hidden>k</span>}
    />
  );
}`}
                        >
                            <div className="w-full max-w-xl">
                                <Textarea
                                    label="Notes"
                                    placeholder="Write your message..."
                                    minRows={3}
                                    leftSection={<span aria-hidden>?</span>}
                                    rightSection={<span aria-hidden>k</span>}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="autosize"
                        title="Autosize"
                        description="Enable autosize to grow the textarea based on content while respecting minimum and maximum row limits."
                    >
                        <Documentation.Showcase
                            code={`import { Textarea } from "@refraktor/core";

export function Demo() {
  return (
    <Textarea
      label="Changelog"
      autosize
      minRows={2}
      maxRows={8}
      placeholder="List your release notes"
    />
  );
}`}
                        >
                            <div className="w-full max-w-xl">
                                <Textarea
                                    label="Changelog"
                                    autosize
                                    minRows={2}
                                    maxRows={8}
                                    placeholder="List your release notes"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="validation"
                        title="Validation and required"
                        description="Use description, required markers, and error messaging to communicate expected content and form state."
                    >
                        <Documentation.Showcase
                            code={`import { Textarea } from "@refraktor/core";

export function Demo() {
  return (
    <Textarea
      label="Project brief"
      description="At least 30 characters."
      required
      withAsterisk
      error="Please provide more detail"
      minRows={3}
    />
  );
}`}
                        >
                            <div className="w-full max-w-xl">
                                <Textarea
                                    label="Project brief"
                                    description="At least 30 characters."
                                    required
                                    withAsterisk
                                    error="Please provide more detail"
                                    minRows={3}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="field-only"
                        title="Field only"
                        description="Use Textarea.Field when composing your own wrapper and helper text layout."
                    >
                        <Documentation.Showcase
                            code={`import { Textarea } from "@refraktor/core";

export function Demo() {
  return (
    <Textarea.Field
      minRows={4}
      variant="filled"
      placeholder="Raw field without wrapper"
    />
  );
}`}
                        >
                            <div className="w-full max-w-xl">
                                <Textarea.Field
                                    minRows={4}
                                    variant="filled"
                                    placeholder="Raw field without wrapper"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Textarea."
                    >
                        <Documentation.ClassesInspector
                            Component={TextareaSlotsShowcase}
                            slots={["root", "leftSection", "rightSection"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="textarea-props"
                        title="Textarea Props"
                        description="Core props for Textarea."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label content rendered above the field."
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
                                name="required"
                                type="boolean"
                                default="false"
                                description="Marks the field as required."
                            />
                            <Documentation.Props.Content
                                name="withAsterisk"
                                type="boolean"
                                default="false"
                                description="Shows an asterisk in the label."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls field visual style."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls spacing and typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls field border radius."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered before the textarea element."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered after the textarea element."
                            />
                            <Documentation.Props.Content
                                name="autosize"
                                type="boolean"
                                default="false"
                                description="Enables automatic height growth based on content."
                            />
                            <Documentation.Props.Content
                                name="minRows"
                                type="number"
                                default="2"
                                description="Minimum rendered rows."
                            />
                            <Documentation.Props.Content
                                name="maxRows"
                                type="number"
                                description="Maximum rendered rows when autosize is enabled."
                            />
                            <Documentation.Props.Content
                                name="resize"
                                type='"none" | "vertical" | "horizontal" | "both"'
                                default='"vertical" ("none" when autosize)'
                                description="Controls native resize behavior."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="TextareaFieldClassNames"
                                description="Slot-level class overrides for root, leftSection, and rightSection."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="textarea-field-props"
                        title="Textarea.Field Props"
                        description="Textarea.Field supports the same field-level props and excludes wrapper helpers like label and description."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="Textarea.Field"
                                type="TextareaFieldProps"
                                description="Use this when rendering a raw field without InputWrapper."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
