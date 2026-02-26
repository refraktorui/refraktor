import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Button,
    Tooltip,
    type RefraktorRadius,
    type TooltipClassNames,
    type TooltipTrigger
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/tooltip/")({
    component: RouteComponent
});

type TooltipPlacement = "top" | "right" | "bottom" | "left";

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

const TooltipPlayground = createPlayground(
    {
        trigger: {
            type: "segmented",
            label: "Trigger",
            options: ["hover", "focus"] as const,
            default: "hover"
        },
        placement: {
            type: "segmented",
            label: "Placement",
            options: ["top", "right", "bottom", "left"] as const,
            default: "top"
        },
        offset: {
            type: "number",
            label: "Offset",
            min: 0,
            max: 24,
            step: 1,
            default: 8
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
        openDelay: {
            type: "number",
            label: "Open Delay",
            min: 0,
            max: 800,
            step: 25,
            default: 0
        },
        closeDelay: {
            type: "number",
            label: "Close Delay",
            min: 0,
            max: 800,
            step: 25,
            default: 0
        },
        showArrow: {
            type: "switch",
            label: "Arrow",
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
            const rootProps = [
                `content="Keyboard shortcut: Ctrl + K"`,
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
                props.openDelay !== defaults.openDelay
                    ? `openDelay={${props.openDelay}}`
                    : null,
                props.closeDelay !== defaults.closeDelay
                    ? `closeDelay={${props.closeDelay}}`
                    : null,
                formatBooleanProp(
                    "showArrow",
                    props.showArrow,
                    defaults.showArrow as boolean
                ),
                formatBooleanProp(
                    "disabled",
                    props.disabled,
                    defaults.disabled as boolean
                )
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [
                    `import { Button, Tooltip } from "@refraktor/core";`
                ],
                jsx: `<Tooltip
${rootProps.map((prop) => `  ${prop}`).join("\n")}
>
  <Button variant="outline">Command palette</Button>
</Tooltip>`
            });
        }
    }
);

interface TooltipSlotsShowcaseProps {
    classNames?: TooltipClassNames;
}

function TooltipSlotsShowcase({ classNames }: TooltipSlotsShowcaseProps) {
    return (
        <Tooltip
            opened
            onOpenedChange={() => {}}
            content="Slot preview"
            showArrow
            withinPortal={false}
            classNames={classNames}
        >
            <Button variant="outline">Inspect slots</Button>
        </Tooltip>
    );
}

function ControlledTooltipShowcase() {
    const [opened, setOpened] = useState(false);

    return (
        <div className="w-full max-w-xl space-y-3">
            <Tooltip
                opened={opened}
                onOpenedChange={setOpened}
                trigger="focus"
                content="Use keyboard focus to open me"
                withinPortal={false}
            >
                <Button variant="outline" onClick={() => setOpened(!opened)}>
                    {opened ? "Hide" : "Show"} tooltip
                </Button>
            </Tooltip>

            <p className="text-sm text-dark-200">
                Tooltip is {opened ? "open" : "closed"}
            </p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Tooltip"
                description="Show concise contextual hints for controls with configurable trigger modes, placement, delays, and optional arrow rendering."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/tooltip/tooltip.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <TooltipPlayground.Wrapper>
                            <TooltipPlayground.Preview>
                                {({
                                    trigger,
                                    placement,
                                    offset,
                                    radius,
                                    openDelay,
                                    closeDelay,
                                    showArrow,
                                    disabled
                                }) => (
                                    <Tooltip
                                        key={`${trigger}-${placement}-${offset}-${radius}-${openDelay}-${closeDelay}-${showArrow}-${disabled}`}
                                        content="Keyboard shortcut: Ctrl + K"
                                        trigger={trigger as TooltipTrigger}
                                        positioning={{
                                            placement: placement as TooltipPlacement,
                                            offset
                                        }}
                                        radius={radius as RefraktorRadius}
                                        openDelay={openDelay}
                                        closeDelay={closeDelay}
                                        showArrow={showArrow}
                                        disabled={disabled}
                                        withinPortal={false}
                                    >
                                        <Button variant="outline">
                                            Command palette
                                        </Button>
                                    </Tooltip>
                                )}
                            </TooltipPlayground.Preview>

                            <TooltipPlayground.Controls />

                            <TooltipPlayground.Code />
                        </TooltipPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="focus-trigger"
                        title="Focus trigger"
                        description="Set trigger to focus for keyboard-friendly help text on form controls."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Tooltip } from "@refraktor/core";

export function Demo() {
  return (
    <Tooltip trigger="focus" content="Press Enter to submit">
      <Button variant="outline">Submit</Button>
    </Tooltip>
  );
}`}
                        >
                            <Tooltip
                                trigger="focus"
                                content="Press Enter to submit"
                                withinPortal={false}
                            >
                                <Button variant="outline">Submit</Button>
                            </Tooltip>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use opened and onOpenedChange when tooltip visibility is synchronized with external app state."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Tooltip } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Tooltip opened={opened} onOpenedChange={setOpened} content="Status details">
      <Button variant="outline" onClick={() => setOpened(!opened)}>
        Toggle tooltip
      </Button>
    </Tooltip>
  );
}`}
                        >
                            <ControlledTooltipShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Tooltip."
                    >
                        <Documentation.ClassesInspector
                            Component={TooltipSlotsShowcase}
                            slots={["root", "trigger", "content", "arrow"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="tooltip-props"
                        title="Tooltip Props"
                        description="The props for the Tooltip component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Trigger element that tooltip interactions attach to."
                                required
                            />
                            <Documentation.Props.Content
                                name="content"
                                type="ReactNode"
                                description="Tooltip body content."
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
                                name="trigger"
                                type='"hover" | "focus"'
                                default='"hover"'
                                description="Interaction mode used to open the tooltip."
                            />
                            <Documentation.Props.Content
                                name="positioning"
                                type="TooltipPositioning"
                                default='{ placement: "top", offset: 8 }'
                                description="Floating placement and offset configuration."
                            />
                            <Documentation.Props.Content
                                name="middlewares"
                                type="TooltipMiddlewares"
                                default='{ flip: true, shift: true, inline: true }'
                                description="Floating middleware configuration."
                            />
                            <Documentation.Props.Content
                                name="openDelay"
                                type="number"
                                default="0"
                                description="Delay before opening in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="closeDelay"
                                type="number"
                                default="0"
                                description="Delay before closing in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="showArrow"
                                type="boolean"
                                default="false"
                                description="Shows a floating arrow aligned to the trigger."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls tooltip content border radius."
                            />
                            <Documentation.Props.Content
                                name="withinPortal"
                                type="boolean"
                                default="true"
                                description="Renders content inside a portal."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables tooltip interaction and rendering."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="TooltipClassNames"
                                description="Slot-level class overrides for root, trigger, content, and arrow."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
