import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Accordion,
    type AccordionClassNames,
    type AccordionVariant,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/accordion/")({
    component: RouteComponent
});

const AccordionPlayground = createPlayground(
    {
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "separated"] as const,
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
            default: "md"
        },
        multiple: {
            type: "switch",
            label: "Multiple",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.variant !== defaults.variant
                    ? `variant="${props.variant}"`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.multiple ? "multiple" : null
            ].filter((value): value is string => value !== null);

            const openingTag =
                rootProps.length > 0
                    ? `<Accordion\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n>`
                    : "<Accordion>";

            return createSnippet({
                imports: [`import { Accordion } from "@refraktor/core";`],
                jsx: `${openingTag}
  <Accordion.Item value="installation">
    <Accordion.Control>How do I install Refraktor?</Accordion.Control>
    <Accordion.Panel>
      Run your package manager of choice and import only the components you need.
    </Accordion.Panel>
  </Accordion.Item>

  <Accordion.Item value="types">
    <Accordion.Control>Is it TypeScript friendly?</Accordion.Control>
    <Accordion.Panel>
      Yes. Every component ships with complete type definitions out of the box.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>`
            });
        }
    }
);

interface AccordionSlotsShowcaseProps {
    classNames?: AccordionClassNames;
}

function AccordionSlotsShowcase({ classNames }: AccordionSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-xl">
            <Accordion defaultValue="slots" classNames={classNames}>
                <Accordion.Item value="slots">
                    <Accordion.Control>
                        Hover slots to inspect classNames
                    </Accordion.Control>
                    <Accordion.Panel>
                        The inspector highlights root, item, control, chevron,
                        and panel slots.
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Accordion"
                description="Display collapsible sections of related content with full keyboard navigation, controlled or uncontrolled state, and flexible compound slots."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/accordion/accordion.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <AccordionPlayground.Wrapper>
                            <AccordionPlayground.Preview>
                                {({ variant, size, radius, multiple }) => (
                                    <Accordion
                                        key={`${variant}-${size}-${radius}-${multiple}`}
                                        variant={variant as AccordionVariant}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        multiple={multiple}
                                        defaultValue={
                                            multiple
                                                ? ["installation"]
                                                : "installation"
                                        }
                                    >
                                        <Accordion.Item value="installation">
                                            <Accordion.Control>
                                                How do I install Refraktor?
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                Run your package manager of
                                                choice and import only the
                                                components you need.
                                            </Accordion.Panel>
                                        </Accordion.Item>

                                        <Accordion.Item value="types">
                                            <Accordion.Control>
                                                Is it TypeScript friendly?
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                Yes. Every component ships with
                                                complete type definitions out of
                                                the box.
                                            </Accordion.Panel>
                                        </Accordion.Item>

                                        <Accordion.Item value="theming">
                                            <Accordion.Control>
                                                Can I customize styles?
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                Use className for root styles
                                                and classNames for slot-level
                                                overrides.
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                )}
                            </AccordionPlayground.Preview>

                            <AccordionPlayground.Controls />

                            <AccordionPlayground.Code />
                        </AccordionPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="multiple-items"
                        title="Multiple items"
                        description="Enable multiple to allow opening more than one item at the same time."
                    >
                        <Documentation.Showcase
                            code={`import { Accordion } from "@refraktor/core";

export function Demo() {
  return (
    <Accordion multiple defaultValue={["react"]}>
      <Accordion.Item value="react">
        <Accordion.Control>React</Accordion.Control>
        <Accordion.Panel>A UI library for building interfaces.</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="typescript">
        <Accordion.Control>TypeScript</Accordion.Control>
        <Accordion.Panel>A typed superset of JavaScript.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`}
                        >
                            <Accordion multiple defaultValue={["react"]}>
                                <Accordion.Item value="react">
                                    <Accordion.Control>React</Accordion.Control>
                                    <Accordion.Panel>
                                        A UI library for building interfaces.
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="typescript">
                                    <Accordion.Control>
                                        TypeScript
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        A typed superset of JavaScript.
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="disabled-item"
                        title="Disabled item"
                        description="Disable specific items to prevent interaction while keeping them visible in the flow."
                    >
                        <Documentation.Showcase
                            code={`import { Accordion } from "@refraktor/core";

export function Demo() {
  return (
    <Accordion defaultValue="available">
      <Accordion.Item value="available">
        <Accordion.Control>Available section</Accordion.Control>
        <Accordion.Panel>This section can be opened and closed.</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="coming-soon" disabled>
        <Accordion.Control>Coming soon</Accordion.Control>
        <Accordion.Panel>This content is not available yet.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`}
                        >
                            <Accordion defaultValue="available">
                                <Accordion.Item value="available">
                                    <Accordion.Control>
                                        Available section
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        This section can be opened and closed.
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="coming-soon" disabled>
                                    <Accordion.Control>
                                        Coming soon
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        This content is not available yet.
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-chevron"
                        title="Custom chevron"
                        description="Pass custom chevron content to Accordion.Control when you need a different indicator style."
                    >
                        <Documentation.Showcase
                            code={`import { Accordion } from "@refraktor/core";

export function Demo() {
  return (
    <Accordion defaultValue="status">
      <Accordion.Item value="status">
        <Accordion.Control chevron={<span aria-hidden>v</span>}>
          Deployment status
        </Accordion.Control>
        <Accordion.Panel>All systems are operational.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`}
                        >
                            <Accordion defaultValue="status">
                                <Accordion.Item value="status">
                                    <Accordion.Control
                                        chevron={<span aria-hidden>v</span>}
                                    >
                                        Deployment status
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        All systems are operational.
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Accordion."
                    >
                        <Documentation.ClassesInspector
                            Component={AccordionSlotsShowcase}
                            slots={[
                                "root",
                                "item",
                                "control",
                                "chevron",
                                "panel"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="accordion-props"
                        title="Accordion Props"
                        description="The props for the Accordion root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Accordion items built with Accordion.Item, Accordion.Control, and Accordion.Panel."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="AccordionValue"
                                description="Controlled opened value(s). Use string or null in single mode, string[] in multiple mode."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="AccordionValue"
                                description="Initial opened value(s) for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: AccordionValue) => void"
                                description="Called when opened value(s) change."
                            />
                            <Documentation.Props.Content
                                name="multiple"
                                type="boolean"
                                default="false"
                                description="Allows multiple items to stay opened."
                            />
                            <Documentation.Props.Content
                                name="collapsible"
                                type="boolean"
                                default="true"
                                description="In single mode, allows closing the currently opened item."
                            />
                            <Documentation.Props.Content
                                name="keepMounted"
                                type="boolean"
                                default="false"
                                description="Keeps closed panels mounted in the DOM."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls spacing and typography of controls and panels."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Border radius applied to items when variant is separated."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "separated"'
                                default='"default"'
                                description="Visual style of accordion items."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="AccordionClassNames"
                                description="Slot-level class overrides for root, item, control, chevron, and panel."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="accordion-item-props"
                        title="Accordion.Item Props"
                        description="The props for Accordion.Item."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Unique value used to identify the item."
                                required
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Item content, usually Accordion.Control and Accordion.Panel."
                                required
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables item interaction and keyboard navigation."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the item root element."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="accordion-control-props"
                        title="Accordion.Control Props"
                        description="The props for Accordion.Control."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Label or content displayed inside the trigger button."
                                required
                            />
                            <Documentation.Props.Content
                                name="chevron"
                                type="ReactNode"
                                description="Custom indicator rendered on the right side of the control."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the trigger button."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="accordion-panel-props"
                        title="Accordion.Panel Props"
                        description="The props for Accordion.Panel."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Content displayed when the item is opened."
                                required
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the panel root element."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
