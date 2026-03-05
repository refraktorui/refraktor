import Documentation from "@/components/Documentation";
import { Input, type InputClassNames } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/input/")({
    component: RouteComponent
});

interface InputSlotsShowcaseProps {
    classNames?: InputClassNames;
}

function InputSlotsShowcase({ classNames }: InputSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <Input
                label="Search"
                description="Use keywords to quickly find components."
                error="Try a more specific search term."
                placeholder="Search components"
                leftSection={<span aria-hidden>?</span>}
                rightSection={<span aria-hidden>k</span>}
                classNames={classNames}
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Input"
                description="Capture short text with label, description, validation feedback, and optional left or right content sections."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/input/input.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <Documentation.Showcase
                            code={`import { Input } from "@refraktor/core";

export function Demo() {
  return (
    <Input
      label="Email"
      description="We'll only use this for account updates."
      placeholder="you@example.com"
      type="email"
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Input
                                    label="Email"
                                    description="We'll only use this for account updates."
                                    placeholder="you@example.com"
                                    type="email"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sections"
                        title="Left and right sections"
                        description="Use leftSection and rightSection for icons, shortcuts, or actions near the input text."
                    >
                        <Documentation.Showcase
                            code={`import { Input } from "@refraktor/core";

export function Demo() {
  return (
    <Input
      label="Search"
      placeholder="Search components"
      leftSection={<span aria-hidden>?</span>}
      rightSection={<span aria-hidden>k</span>}
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Input
                                    label="Search"
                                    placeholder="Search components"
                                    leftSection={<span aria-hidden>?</span>}
                                    rightSection={<span aria-hidden>k</span>}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="error-state"
                        title="Error and required"
                        description="Set required and provide an error message to communicate invalid input states clearly."
                    >
                        <Documentation.Showcase
                            code={`import { Input } from "@refraktor/core";

export function Demo() {
  return (
    <Input
      label="Username"
      required
      withAsterisk
      error="Username is already taken"
      defaultValue="alex"
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Input
                                    label="Username"
                                    required
                                    withAsterisk
                                    error="Username is already taken"
                                    defaultValue="alex"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="compound-api"
                        title="Compound API"
                        description="Compose the building blocks manually with Input.Wrapper, Input.Label, Input.Description, Input.Field, and Input.Error when you need full layout control."
                    >
                        <Documentation.Showcase
                            code={`import { Input } from "@refraktor/core";

export function Demo() {
  return (
    <Input.Wrapper inputId="project-name">
      <Input.Label htmlFor="project-name" required>
        Project name
      </Input.Label>
      <Input.Description>Used in URLs and dashboards.</Input.Description>
      <Input.Field id="project-name" placeholder="my-project" />
      <Input.Error>Only letters, numbers, and dashes are allowed.</Input.Error>
    </Input.Wrapper>
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <Input.Wrapper inputId="project-name">
                                    <Input.Label htmlFor="project-name" required>
                                        Project name
                                    </Input.Label>
                                    <Input.Description>
                                        Used in URLs and dashboards.
                                    </Input.Description>
                                    <Input.Field
                                        id="project-name"
                                        placeholder="my-project"
                                    />
                                    <Input.Error>
                                        Only letters, numbers, and dashes are
                                        allowed.
                                    </Input.Error>
                                </Input.Wrapper>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Input."
                    >
                        <Documentation.ClassesInspector
                            Component={InputSlotsShowcase}
                            slots={[
                                "wrapper",
                                "label",
                                "description",
                                "error",
                                "field",
                                "root",
                                "leftSection",
                                "rightSection"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="input-props"
                        title="Input Props"
                        description="The props for the Input component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label content displayed above the input field."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered below the label."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error content displayed below the field and enables invalid styling."
                            />
                            <Documentation.Props.Content
                                name="required"
                                type="boolean"
                                default="false"
                                description="Marks the input as required."
                            />
                            <Documentation.Props.Content
                                name="withAsterisk"
                                type="boolean"
                                default="false"
                                description="Shows an asterisk next to the label."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls the field visual style."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls input height, padding, and text size."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the field container."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered before the input element."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered after the input element."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the field root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="InputClassNames"
                                description="Slot-level class overrides for wrapper, label, description, error, field, root, leftSection, and rightSection."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
