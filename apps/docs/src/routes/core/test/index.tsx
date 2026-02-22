import Documentation, { createPlayground } from "@/components/Documentation";
import { Button } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { IconArrowRight } from "@tabler/icons-react";

export const Route = createFileRoute("/core/test/")({
    component: RouteComponent
});

const ButtonPlayground = createPlayground({
    variant: {
        type: "segmented",
        label: "Variant",
        description: "The visual style of the button.",
        options: [
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" }
        ],
        default: "filled"
    },
    size: {
        type: "select",
        label: "Size",
        description: "Controls the padding and font size.",
        options: ["xs", "sm", "md", "lg", "xl"] as const,
        default: "md"
    },
    disabled: {
        type: "switch",
        label: "Disabled",
        description: "Disables the button and reduces its opacity.",
        default: false
    },
    loading: {
        type: "switch",
        label: "Loading",
        description: "Shows a spinner and disables interaction.",
        default: false
    },
    fullWidth: {
        type: "switch",
        label: "Full Width",
        description: "Stretches the button to fill its container.",
        default: false
    }
});

const demoCode = `import { Button } from "@refraktor/core";

export function Demo() {
    return (
        <Button
            variant="filled"
            size="md"
        >
            Button
        </Button>
    );
}`;

const demoCodeSecondary = `import { Button } from "@refraktor/core";

export function DemoAlt() {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                Back
            </Button>
            <Button variant="filled" size="sm" loading>
                Saving...
            </Button>
            <Button variant="ghost" size="sm" disabled>
                Disabled
            </Button>
        </div>
    );
}`;

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Button"
                description="A polymorphic button component that supports multiple visual variants, sizes, loading states, and can render as any element or component via the as prop."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/button/button.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section
                        id="playground"
                        title="Playground"
                        description="Interact with the controls below to explore the component's props live."
                    >
                        <ButtonPlayground.Wrapper>
                            <ButtonPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    disabled,
                                    loading,
                                    fullWidth
                                }) => (
                                    <Button
                                        variant={
                                            variant as
                                                | "filled"
                                                | "outline"
                                                | "ghost"
                                        }
                                        size={
                                            size as
                                                | "xs"
                                                | "sm"
                                                | "md"
                                                | "lg"
                                                | "xl"
                                        }
                                        disabled={disabled}
                                        loading={loading}
                                        fullWidth={fullWidth}
                                    >
                                        Button
                                    </Button>
                                )}
                            </ButtonPlayground.Preview>

                            <ButtonPlayground.Controls />

                            <ButtonPlayground.Code
                                files={[
                                    {
                                        name: "Demo.tsx",
                                        language: "tsx",
                                        code: demoCode
                                    },
                                    {
                                        name: "DemoAlt.tsx",
                                        language: "tsx",
                                        code: demoCodeSecondary
                                    }
                                ]}
                            />
                        </ButtonPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="usage"
                        title="Usage"
                        description="Import the component and use it directly. No additional setup required."
                    >
                        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dark-700 bg-dark-800/30">
                            <Button variant="filled">Filled</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="filled" loading>
                                Loading
                            </Button>
                            <Button variant="filled" disabled>
                                Disabled
                            </Button>
                        </div>
                    </Documentation.Section>

                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover over a slot name to highlight the corresponding part of the component. On touch devices, tap to toggle."
                    >
                        <Documentation.ClassesInspector
                            Component={Button}
                            slots={["root", "container", "leftSection", "rightSection"]}
                            componentProps={{
                                variant: "filled",
                                leftSection: <IconArrowRight size={16} />,
                                rightSection: <IconArrowRight size={16} />,
                                children: "Button"
                            }}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="props"
                        title="Props"
                        description="The props for the Button component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline" | "ghost"'
                                default='"default"'
                                description="The visual style of the button."
                                required
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls the padding and font size."
                            />
                            <Documentation.Props.Content
                                name="loading"
                                type="boolean"
                                default="false"
                                description="Shows a spinner and disables interaction."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables the button and reduces its opacity."
                            />
                            <Documentation.Props.Content
                                name="as"
                                type="React.ElementType"
                                default='"button"'
                                description="Render the button as a different element or component, e.g. an anchor tag."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered to the left of the label."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered to right of the label."
                            />
                            <Documentation.Props.Content
                                name="fullWidth"
                                type="boolean"
                                default="false"
                                description="Stretches the button to fill its container."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
