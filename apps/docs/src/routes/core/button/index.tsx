import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Button,
    type ButtonClassNames,
    type ButtonProps,
    type RefraktorRadius
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { IconArrowRight, IconDownload, IconPlus } from "@tabler/icons-react";

export const Route = createFileRoute("/core/button/")({
    component: RouteComponent
});

type ButtonVariant = "default" | "filled" | "outline" | "ghost";

function isIconSize(size: string): boolean {
    return size.startsWith("icon-");
}

const ButtonPlayground = createPlayground(
    {
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "filled", "outline", "ghost"] as const,
            default: "default"
        },
        size: {
            type: "select",
            label: "Size",
            options: [
                "xs",
                "sm",
                "md",
                "lg",
                "xl",
                "icon-xs",
                "icon-sm",
                "icon-md",
                "icon-lg",
                "icon-xl"
            ] as const,
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
            default: "md"
        },
        fullWidth: {
            type: "switch",
            label: "Full Width",
            default: false
        },
        loading: {
            type: "switch",
            label: "Loading",
            default: false
        },
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        },
        label: {
            type: "text",
            label: "Label",
            default: "Continue"
        }
    },
    {
        code: (props, defaults) => {
            const iconOnly = isIconSize(props.size);
            const content = iconOnly
                ? "<IconPlus size={16} aria-hidden />"
                : props.label.trim() || "Button";

            return createSnippet({
                imports: iconOnly
                    ? [
                          `import { Button } from "@refraktor/core";`,
                          `import { IconPlus } from "@tabler/icons-react";`
                      ]
                    : [`import { Button } from "@refraktor/core";`],
                component: "Button",
                values: {
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    fullWidth: props.fullWidth,
                    loading: props.loading,
                    disabled: props.disabled,
                    "aria-label": iconOnly ? "Add item" : undefined
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    fullWidth: defaults.fullWidth,
                    loading: defaults.loading,
                    disabled: defaults.disabled
                },
                children: content
            });
        }
    }
);

interface ButtonSlotsShowcaseProps {
    classNames?: ButtonClassNames;
}

function ButtonSlotsShowcase({ classNames }: ButtonSlotsShowcaseProps) {
    return (
        <Button
            leftSection={<IconDownload size={16} aria-hidden />}
            rightSection={<IconArrowRight size={16} aria-hidden />}
            classNames={classNames}
        >
            Download
        </Button>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Button"
                description="Trigger actions with configurable variants, sizes, icon layouts, and loading states in a single flexible component."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/button/button.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ButtonPlayground.Wrapper>
                            <ButtonPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    fullWidth,
                                    loading,
                                    disabled,
                                    label
                                }) => {
                                    const iconOnly = isIconSize(size);

                                    return (
                                        <Button
                                            key={`${variant}-${size}-${radius}-${fullWidth}-${loading}-${disabled}-${label}`}
                                            variant={variant as ButtonVariant}
                                            size={size as ButtonProps["size"]}
                                            radius={radius as RefraktorRadius}
                                            fullWidth={fullWidth}
                                            loading={loading}
                                            disabled={disabled}
                                            aria-label={
                                                iconOnly
                                                    ? "Add item"
                                                    : undefined
                                            }
                                        >
                                            {iconOnly ? (
                                                <IconPlus
                                                    size={16}
                                                    aria-hidden
                                                />
                                            ) : (
                                                label.trim() || "Button"
                                            )}
                                        </Button>
                                    );
                                }}
                            </ButtonPlayground.Preview>

                            <ButtonPlayground.Controls />

                            <ButtonPlayground.Code />
                        </ButtonPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="variants"
                        title="Variants"
                        description="Use variant to choose the right visual emphasis for the action hierarchy."
                    >
                        <Documentation.Showcase
                            code={`import { Button } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="default">Default</Button>
      <Button variant="filled">Filled</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`}
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="default">Default</Button>
                                <Button variant="filled">Filled</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sections"
                        title="Left and right sections"
                        description="Add icons before or after the label with leftSection and rightSection for directional actions."
                    >
                        <Documentation.Showcase
                            code={`import { Button } from "@refraktor/core";
import { IconArrowRight, IconDownload } from "@tabler/icons-react";

export function Demo() {
  return (
    <Button
      leftSection={<IconDownload size={16} aria-hidden />}
      rightSection={<IconArrowRight size={16} aria-hidden />}
    >
      Download report
    </Button>
  );
}`}
                        >
                            <Button
                                leftSection={
                                    <IconDownload size={16} aria-hidden />
                                }
                                rightSection={
                                    <IconArrowRight size={16} aria-hidden />
                                }
                            >
                                Download report
                            </Button>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="loading"
                        title="Loading state"
                        description="Set loading to replace the left section with a loader and lock interaction while an action is in progress."
                    >
                        <Documentation.Showcase
                            code={`import { Button } from "@refraktor/core";

export function Demo() {
  return <Button loading>Saving changes</Button>;
}`}
                        >
                            <Button loading>Saving changes</Button>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="icon-button"
                        title="Icon button"
                        description="Use icon-* sizes for compact icon-only actions and provide an accessible label."
                    >
                        <Documentation.Showcase
                            code={`import { Button } from "@refraktor/core";
import { IconPlus } from "@tabler/icons-react";

export function Demo() {
  return (
    <Button size="icon-md" aria-label="Create item">
      <IconPlus size={16} aria-hidden />
    </Button>
  );
}`}
                        >
                            <Button size="icon-md" aria-label="Create item">
                                <IconPlus size={16} aria-hidden />
                            </Button>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Button."
                    >
                        <Documentation.ClassesInspector
                            Component={ButtonSlotsShowcase}
                            slots={[
                                "root",
                                "container",
                                "leftSection",
                                "rightSection"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="button-props"
                        title="Button Props"
                        description="The props for the Button component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Button label or custom inline content."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline" | "ghost"'
                                default='"default"'
                                description="Controls the visual style used for emphasis."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl" | "icon-xs" | "icon-sm" | "icon-md" | "icon-lg" | "icon-xl"'
                                default='"md"'
                                description="Controls dimensions, spacing, and typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the root element."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables interaction on button elements."
                            />
                            <Documentation.Props.Content
                                name="loading"
                                type="boolean"
                                default="false"
                                description="Shows a loader and disables interaction while true."
                            />
                            <Documentation.Props.Content
                                name="loaderProps"
                                type="LoaderProps"
                                description="Props forwarded to the internal Loader component."
                            />
                            <Documentation.Props.Content
                                name="fullWidth"
                                type="boolean"
                                default="false"
                                description="Expands the button to 100% width of its container."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered before the button label."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered after the button label."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ButtonClassNames"
                                description="Slot-level class overrides for root, container, leftSection, and rightSection."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
