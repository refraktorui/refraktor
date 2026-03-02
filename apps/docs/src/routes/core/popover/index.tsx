import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Button,
    Popover,
    type PopoverClassNames,
    type PopoverTriggerType,
    type RefraktorRadius
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/popover/")({
    component: RouteComponent
});

type PopoverPlacement = "top" | "right" | "bottom" | "left";

function formatBooleanProp(
    name: string,
    value: boolean,
    defaultValue: boolean
): string | null {
    if (value === defaultValue) {
        return null;
    }

    return value ? name : `${name}={false}`;
}

const PopoverPlayground = createPlayground(
    {
        trigger: {
            type: "segmented",
            label: "Trigger",
            options: ["click", "hover", "focus"] as const,
            default: "click"
        },
        placement: {
            type: "segmented",
            label: "Placement",
            options: ["top", "right", "bottom", "left"] as const,
            default: "bottom"
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
        offset: {
            type: "number",
            label: "Offset",
            min: 0,
            max: 24,
            step: 1,
            default: 8
        },
        showArrow: {
            type: "switch",
            label: "Arrow",
            default: false
        },
        closeOnClickOutside: {
            type: "switch",
            label: "Outside Click",
            default: true
        },
        closeOnEscape: {
            type: "switch",
            label: "Escape Key",
            default: true
        },
        trapFocus: {
            type: "switch",
            label: "Trap Focus",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.trigger !== defaults.trigger
                    ? `trigger="${props.trigger}"`
                    : null,
                props.placement !== defaults.placement ||
                props.offset !== defaults.offset
                    ? `positioning={{ placement: "${props.placement}", offset: ${props.offset} }}`
                    : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                formatBooleanProp(
                    "showArrow",
                    props.showArrow,
                    defaults.showArrow as boolean
                ),
                formatBooleanProp(
                    "closeOnClickOutside",
                    props.closeOnClickOutside,
                    defaults.closeOnClickOutside as boolean
                ),
                formatBooleanProp(
                    "closeOnEscape",
                    props.closeOnEscape,
                    defaults.closeOnEscape as boolean
                ),
                formatBooleanProp(
                    "trapFocus",
                    props.trapFocus,
                    defaults.trapFocus as boolean
                )
            ].filter((value): value is string => value !== null);

            const openingTag =
                rootProps.length > 0
                    ? `<Popover\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n>`
                    : "<Popover>";

            return createSnippet({
                imports: [
                    `import { Button, Popover } from "@refraktor/core";`
                ],
                jsx: `${openingTag}
  <Popover.Trigger>
    <Button variant="outline">Open popover</Button>
  </Popover.Trigger>

  <Popover.Dropdown>
    <p>Popover content goes here.</p>
  </Popover.Dropdown>
</Popover>`
            });
        }
    }
);

interface PopoverSlotsShowcaseProps {
    classNames?: PopoverClassNames;
}

function PopoverSlotsShowcase({ classNames }: PopoverSlotsShowcaseProps) {
    return (
        <Popover showArrow classNames={classNames} withinPortal={false}>
            <Popover.Trigger>
                <Button variant="outline">Inspect slots</Button>
            </Popover.Trigger>

            <Popover.Dropdown>
                <p className="text-sm">Slot highlighting preview.</p>
            </Popover.Dropdown>
        </Popover>
    );
}

function ControlledPopoverShowcase() {
    const [opened, setOpened] = useState(false);

    return (
        <div className="w-full max-w-md space-y-3">
            <Popover
                opened={opened}
                onOpenedChange={setOpened}
                showArrow
                withinPortal={false}
            >
                <Popover.Trigger>
                    <Button variant="outline">
                        {opened ? "Close" : "Open"} filters
                    </Button>
                </Popover.Trigger>

                <Popover.Dropdown>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Filters</p>
                        <p className="text-dark-200">
                            Sync popover state with external controls.
                        </p>
                        <Button size="sm" onClick={() => setOpened(false)}>
                            Apply
                        </Button>
                    </div>
                </Popover.Dropdown>
            </Popover>

            <p className="text-sm text-dark-200">
                Popover is {opened ? "opened" : "closed"}
            </p>
        </div>
    );
}

function TriggerModesShowcase() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Popover trigger="click" withinPortal={false}>
                <Popover.Trigger>
                    <Button variant="outline" size="sm">
                        Click
                    </Button>
                </Popover.Trigger>
                <Popover.Dropdown>
                    <p className="text-sm">Opens on click.</p>
                </Popover.Dropdown>
            </Popover>

            <Popover
                trigger="hover"
                openDelay={100}
                closeDelay={120}
                withinPortal={false}
            >
                <Popover.Trigger>
                    <Button variant="outline" size="sm">
                        Hover
                    </Button>
                </Popover.Trigger>
                <Popover.Dropdown>
                    <p className="text-sm">Opens on hover.</p>
                </Popover.Dropdown>
            </Popover>

            <Popover trigger="focus" withinPortal={false}>
                <Popover.Trigger>
                    <Button variant="outline" size="sm">
                        Focus
                    </Button>
                </Popover.Trigger>
                <Popover.Dropdown>
                    <p className="text-sm">Opens on focus.</p>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Popover"
                description="Display contextual floating content anchored to a trigger with configurable placement, trigger behavior, and optional arrow support."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/popover/popover.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <PopoverPlayground.Wrapper>
                            <PopoverPlayground.Preview>
                                {({
                                    trigger,
                                    placement,
                                    radius,
                                    offset,
                                    showArrow,
                                    closeOnClickOutside,
                                    closeOnEscape,
                                    trapFocus
                                }) => (
                                    <Popover
                                        key={`${trigger}-${placement}-${radius}-${offset}-${showArrow}-${closeOnClickOutside}-${closeOnEscape}-${trapFocus}`}
                                        trigger={trigger as PopoverTriggerType}
                                        positioning={{
                                            placement: placement as PopoverPlacement,
                                            offset
                                        }}
                                        radius={radius as RefraktorRadius}
                                        showArrow={showArrow}
                                        closeOnClickOutside={closeOnClickOutside}
                                        closeOnEscape={closeOnEscape}
                                        trapFocus={trapFocus}
                                        withinPortal={false}
                                    >
                                        <Popover.Trigger>
                                            <Button variant="outline">
                                                Open popover
                                            </Button>
                                        </Popover.Trigger>

                                        <Popover.Dropdown>
                                            <div className="space-y-1 text-sm">
                                                <p className="font-medium">
                                                    Invite teammates
                                                </p>
                                                <p className="text-dark-200">
                                                    Share read or edit access for
                                                    this workspace.
                                                </p>
                                            </div>
                                        </Popover.Dropdown>
                                    </Popover>
                                )}
                            </PopoverPlayground.Preview>

                            <PopoverPlayground.Controls />

                            <PopoverPlayground.Code />
                        </PopoverPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use opened and onOpenedChange when popover state is managed by external UI logic."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Popover } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onOpenedChange={setOpened}>
      <Popover.Trigger>
        <Button variant="outline">Filters</Button>
      </Popover.Trigger>
      <Popover.Dropdown>
        <Button size="sm" onClick={() => setOpened(false)}>
          Apply
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}`}
                        >
                            <ControlledPopoverShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="trigger-modes"
                        title="Trigger modes"
                        description="Choose click, hover, or focus trigger behavior based on interaction context."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Popover } from "@refraktor/core";

export function Demo() {
  return (
    <>
      <Popover trigger="click">...</Popover>
      <Popover trigger="hover" openDelay={100} closeDelay={120}>...</Popover>
      <Popover trigger="focus">...</Popover>
    </>
  );
}`}
                        >
                            <TriggerModesShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="arrow-and-positioning"
                        title="Arrow and positioning"
                        description="Enable showArrow and customize positioning placement and offset to match nearby trigger context."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Popover } from "@refraktor/core";

export function Demo() {
  return (
    <Popover
      showArrow
      positioning={{ placement: "right", offset: 12 }}
      radius="lg"
    >
      <Popover.Trigger>
        <Button variant="outline">Details</Button>
      </Popover.Trigger>
      <Popover.Dropdown>
        Context-aware information panel.
      </Popover.Dropdown>
    </Popover>
  );
}`}
                        >
                            <Popover
                                showArrow
                                positioning={{ placement: "right", offset: 12 }}
                                radius="lg"
                                withinPortal={false}
                            >
                                <Popover.Trigger>
                                    <Button variant="outline">Details</Button>
                                </Popover.Trigger>
                                <Popover.Dropdown>
                                    <p className="text-sm">
                                        Context-aware information panel.
                                    </p>
                                </Popover.Dropdown>
                            </Popover>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Popover."
                    >
                        <Documentation.ClassesInspector
                            Component={PopoverSlotsShowcase}
                            slots={["root", "trigger", "dropdown", "arrow"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="popover-props"
                        title="Popover Props"
                        description="The props for the Popover root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Popover.Trigger and Popover.Dropdown structure."
                                required
                            />
                            <Documentation.Props.Content
                                name="opened"
                                type="boolean"
                                description="Controlled open state."
                            />
                            <Documentation.Props.Content
                                name="defaultOpened"
                                type="boolean"
                                default="false"
                                description="Initial open state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onOpenedChange"
                                type="(opened: boolean) => void"
                                description="Called when open state changes."
                            />
                            <Documentation.Props.Content
                                name="positioning"
                                type="PopoverPositioning"
                                default='{ placement: "bottom", offset: 8 }'
                                description="Floating placement and distance from trigger."
                            />
                            <Documentation.Props.Content
                                name="strategy"
                                type='"absolute" | "fixed"'
                                default='"fixed"'
                                description="Floating UI positioning strategy for the popover."
                            />
                            <Documentation.Props.Content
                                name="middlewares"
                                type="PopoverMiddlewares"
                                default='{ flip: true, shift: true }'
                                description="Floating middleware configuration."
                            />
                            <Documentation.Props.Content
                                name="trigger"
                                type='"click" | "hover" | "focus"'
                                default='"click"'
                                description="Interaction mode used to open the popover."
                            />
                            <Documentation.Props.Content
                                name="openDelay"
                                type="number"
                                default="0"
                                description="Delay in milliseconds before opening."
                            />
                            <Documentation.Props.Content
                                name="closeDelay"
                                type="number"
                                default="0"
                                description="Delay in milliseconds before closing."
                            />
                            <Documentation.Props.Content
                                name="showArrow"
                                type="boolean"
                                default="false"
                                description="Shows a floating arrow anchored to the trigger."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Border radius for the dropdown surface."
                            />
                            <Documentation.Props.Content
                                name="withinPortal"
                                type="boolean"
                                default="true"
                                description="Renders dropdown in a portal when true."
                            />
                            <Documentation.Props.Content
                                name="closeOnClickOutside"
                                type="boolean"
                                default="true"
                                description="Closes popover when clicking outside."
                            />
                            <Documentation.Props.Content
                                name="closeOnEscape"
                                type="boolean"
                                default="true"
                                description="Closes popover when pressing Escape."
                            />
                            <Documentation.Props.Content
                                name="trapFocus"
                                type="boolean"
                                default="false"
                                description="Traps keyboard focus within dropdown while open."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="PopoverClassNames"
                                description="Slot-level class overrides for root, trigger, dropdown, and arrow."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="popover-trigger-props"
                        title="Popover.Trigger Props"
                        description="The props for Popover.Trigger."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Element used as the anchor and interaction target."
                                required
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the trigger wrapper."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="popover-dropdown-props"
                        title="Popover.Dropdown Props"
                        description="The props for Popover.Dropdown."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Content rendered inside the floating panel."
                                required
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the dropdown container."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
