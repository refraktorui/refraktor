import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    ScrollArea,
    cx,
    type ScrollAreaClassNames,
    type ScrollAreaOrientation
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/scroll-area/")({
    component: RouteComponent
});

const sidebarItems = [
    "Getting started",
    "Installation",
    "Colors",
    "Typography",
    "Spacing",
    "Components",
    "Accessibility",
    "Tokens",
    "CLI",
    "Migration"
];

const commandLogs = [
    "[10:12:04] Connected to room #support",
    "[10:12:08] User: Dropdown list is clipping on Firefox",
    "[10:12:19] Agent: Repro confirmed on Windows",
    "[10:12:32] Agent: Applying shared ScrollArea primitive",
    "[10:12:43] Agent: Validating in Chromium + Firefox",
    "[10:12:59] Agent: Patch merged"
];

const tagCloud = [
    "React",
    "TypeScript",
    "Vitest",
    "Router",
    "Tailwind",
    "Accessibility",
    "Animation",
    "Design Tokens",
    "Build",
    "CLI",
    "Testing",
    "Docs"
];

const ScrollAreaPlayground = createPlayground(
    {
        orientation: {
            type: "segmented",
            label: "Orientation",
            options: ["vertical", "horizontal", "both"] as const,
            default: "vertical"
        },
        scrollbarSize: {
            type: "number",
            label: "Scrollbar Size",
            min: 4,
            max: 14,
            step: 1,
            default: 6
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.orientation !== defaults.orientation
                    ? `orientation="${props.orientation}"`
                    : null,
                props.scrollbarSize !== defaults.scrollbarSize
                    ? `scrollbarSize={${props.scrollbarSize}}`
                    : null,
                `className="max-h-52 rounded-md border border-[var(--refraktor-border)] p-1"`
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [`import { ScrollArea } from "@refraktor/core";`],
                jsx: `<ScrollArea\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n>
  {Array.from({ length: 10 }).map((_, index) => (
    <div key={index} className="rounded-sm px-2 py-1 text-sm">
      Item {index + 1}
    </div>
  ))}
</ScrollArea>`
            });
        }
    }
);

interface ScrollAreaSlotsShowcaseProps {
    classNames?: ScrollAreaClassNames;
}

function ScrollAreaSlotsShowcase({ classNames }: ScrollAreaSlotsShowcaseProps) {
    return (
        <ScrollArea
            classNames={classNames}
            className="max-h-40 rounded-md border border-[var(--refraktor-border)] p-1"
        >
            {sidebarItems.map((item) => (
                <div
                    key={item}
                    className="rounded-sm px-2 py-1.5 text-sm text-[var(--refraktor-text)]"
                >
                    {item}
                </div>
            ))}
        </ScrollArea>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="ScrollArea"
                description="Render a consistent, theme-aware scrollbar container for sidebars, dropdown lists, code snippets, and chat-like panels."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/scroll-area/scroll-area.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ScrollAreaPlayground.Wrapper>
                            <ScrollAreaPlayground.Preview>
                                {({ orientation, scrollbarSize }) => {
                                    const resolvedOrientation =
                                        orientation as ScrollAreaOrientation;

                                    return (
                                        <ScrollArea
                                            orientation={resolvedOrientation}
                                            scrollbarSize={scrollbarSize}
                                            className={cx(
                                                "rounded-md border border-[var(--refraktor-border)]",
                                                resolvedOrientation === "horizontal"
                                                    ? "w-full p-2"
                                                    : "max-h-52 p-1"
                                            )}
                                        >
                                            {resolvedOrientation ===
                                            "horizontal" ? (
                                                <div className="flex w-max gap-2">
                                                    {tagCloud.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)] px-3 py-1 text-sm"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : resolvedOrientation === "both" ? (
                                                <div className="grid w-[720px] grid-cols-3 gap-2 p-1">
                                                    {Array.from({ length: 18 }).map(
                                                        (_, index) => (
                                                            <div
                                                                key={index}
                                                                className="rounded-sm border border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)] px-2 py-1.5 text-sm"
                                                            >
                                                                Card {index + 1}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    {sidebarItems.map((item) => (
                                                        <div
                                                            key={item}
                                                            className="rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--refraktor-bg-hover)]"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    );
                                }}
                            </ScrollAreaPlayground.Preview>

                            <ScrollAreaPlayground.Controls />

                            <ScrollAreaPlayground.Code />
                        </ScrollAreaPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="patterns"
                        title="Common patterns"
                        description="Use ScrollArea as a drop-in container for tall lists and overflow-heavy surfaces."
                    >
                        <Documentation.Showcase
                            code={`import { ScrollArea } from "@refraktor/core";

export function Demo() {
  return (
    <ScrollArea className="max-h-52 rounded-md border border-[var(--refraktor-border)] p-1">
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </ScrollArea>
  );
}`}
                        >
                            <div className="grid w-full gap-4 md:grid-cols-2">
                                <ScrollArea className="max-h-48 rounded-md border border-[var(--refraktor-border)] p-1">
                                    {sidebarItems.map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-sm px-2 py-1.5 text-sm"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </ScrollArea>

                                <ScrollArea className="max-h-48 rounded-md border border-[var(--refraktor-border)] p-1">
                                    {commandLogs.map((line) => (
                                        <div
                                            key={line}
                                            className="border-b border-[var(--refraktor-border)] px-2 py-1.5 font-mono text-xs last:border-b-0"
                                        >
                                            {line}
                                        </div>
                                    ))}
                                </ScrollArea>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of ScrollArea."
                    >
                        <Documentation.ClassesInspector
                            Component={ScrollAreaSlotsShowcase}
                            slots={["root"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="scroll-area-props"
                        title="ScrollArea Props"
                        description="The props for the ScrollArea component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Content rendered inside the scroll container."
                                required
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"vertical" | "horizontal" | "both"'
                                default='"vertical"'
                                description="Controls whether scrolling is vertical, horizontal, or both."
                            />
                            <Documentation.Props.Content
                                name="scrollbarSize"
                                type="number"
                                default="6"
                                description="Scrollbar thickness in pixels."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ScrollAreaClassNames"
                                description="Slot-level class overrides for root."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
