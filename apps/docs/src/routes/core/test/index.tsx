import Documentation from "@/components/Documentation";
import { Button } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/test/")({
    component: RouteComponent
});

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
