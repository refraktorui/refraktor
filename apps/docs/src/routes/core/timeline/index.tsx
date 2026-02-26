import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Timeline,
    type RefraktorRadius,
    type RefraktorSize,
    type TimelineClassNames,
    type TimelineLineVariant,
    type TimelineOrientation
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/timeline/")({
    component: RouteComponent
});

const TimelinePlayground = createPlayground(
    {
        orientation: {
            type: "segmented",
            label: "Orientation",
            options: ["vertical", "horizontal"] as const,
            default: "vertical"
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
            default: "full"
        },
        lineVariant: {
            type: "segmented",
            label: "Line",
            options: ["solid", "dashed", "dotted"] as const,
            default: "solid"
        },
        active: {
            type: "number",
            label: "Active Index",
            min: -1,
            max: 3,
            step: 1,
            default: 1
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.orientation !== defaults.orientation
                    ? `orientation="${props.orientation}"`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.lineVariant !== defaults.lineVariant
                    ? `lineVariant="${props.lineVariant}"`
                    : null,
                props.active !== defaults.active
                    ? `active={${props.active}}`
                    : null
            ].filter((value): value is string => value !== null);

            return createSnippet({
                imports: [`import { Timeline } from "@refraktor/core";`],
                jsx: `<Timeline
${rootProps.map((prop) => `  ${prop}`).join("\n")}
>
  <Timeline.Item date="09:00" title="Planning">
    Define scope and milestones.
  </Timeline.Item>
  <Timeline.Item date="11:30" title="Development">
    Implement primary features.
  </Timeline.Item>
  <Timeline.Item date="14:00" title="Review">
    QA and stakeholder validation.
  </Timeline.Item>
</Timeline>`
            });
        }
    }
);

interface TimelineSlotsShowcaseProps {
    classNames?: TimelineClassNames;
}

function TimelineSlotsShowcase({ classNames }: TimelineSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-2xl">
            <Timeline classNames={classNames} active={1} lineVariant="dashed">
                <Timeline.Item date="Mar 1" title="Kickoff">
                    Team alignment and requirements.
                </Timeline.Item>
                <Timeline.Item date="Mar 4" title="Execution">
                    Build feature scope.
                </Timeline.Item>
                <Timeline.Item date="Mar 8" title="Launch">
                    Ship to production.
                </Timeline.Item>
            </Timeline>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Timeline"
                description="Display chronological milestones with composable items, active-step highlighting, and configurable connector styles."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/timeline/timeline.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <TimelinePlayground.Wrapper>
                            <TimelinePlayground.Preview>
                                {({
                                    orientation,
                                    size,
                                    radius,
                                    lineVariant,
                                    active
                                }) => (
                                    <div className="w-full max-w-2xl">
                                        <Timeline
                                            key={`${orientation}-${size}-${radius}-${lineVariant}-${active}`}
                                            orientation={
                                                orientation as TimelineOrientation
                                            }
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            lineVariant={
                                                lineVariant as TimelineLineVariant
                                            }
                                            active={active}
                                        >
                                            <Timeline.Item
                                                date="09:00"
                                                title="Planning"
                                            >
                                                Define scope and milestones.
                                            </Timeline.Item>
                                            <Timeline.Item
                                                date="11:30"
                                                title="Development"
                                            >
                                                Implement primary features.
                                            </Timeline.Item>
                                            <Timeline.Item
                                                date="14:00"
                                                title="Review"
                                            >
                                                QA and stakeholder validation.
                                            </Timeline.Item>
                                            <Timeline.Item
                                                date="16:00"
                                                title="Release"
                                            >
                                                Final deployment and handoff.
                                            </Timeline.Item>
                                        </Timeline>
                                    </div>
                                )}
                            </TimelinePlayground.Preview>

                            <TimelinePlayground.Controls />

                            <TimelinePlayground.Code />
                        </TimelinePlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-bullets"
                        title="Custom bullets"
                        description="Render icons or short labels inside bullets to communicate step status quickly."
                    >
                        <Documentation.Showcase
                            code={`import { Timeline } from "@refraktor/core";

export function Demo() {
  return (
    <Timeline active={2}>
      <Timeline.Item title="Design" bullet="1">Wireframes</Timeline.Item>
      <Timeline.Item title="Build" bullet="2">Implementation</Timeline.Item>
      <Timeline.Item title="Ship" bullet="3">Production rollout</Timeline.Item>
    </Timeline>
  );
}`}
                        >
                            <div className="w-full max-w-2xl">
                                <Timeline active={2}>
                                    <Timeline.Item title="Design" bullet="1">
                                        Wireframes and interaction mapping.
                                    </Timeline.Item>
                                    <Timeline.Item title="Build" bullet="2">
                                        Implementation and QA.
                                    </Timeline.Item>
                                    <Timeline.Item title="Ship" bullet="3">
                                        Production rollout.
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="without-line"
                        title="Disable item connector"
                        description="Set line to false for terminal or standalone milestones that should not render trailing connectors."
                    >
                        <Documentation.Showcase
                            code={`import { Timeline } from "@refraktor/core";

export function Demo() {
  return (
    <Timeline>
      <Timeline.Item title="Submitted">Request received</Timeline.Item>
      <Timeline.Item title="Approved" line={false}>Final decision</Timeline.Item>
    </Timeline>
  );
}`}
                        >
                            <div className="w-full max-w-2xl">
                                <Timeline>
                                    <Timeline.Item title="Submitted">
                                        Request received
                                    </Timeline.Item>
                                    <Timeline.Item title="Approved" line={false}>
                                        Final decision
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Timeline."
                    >
                        <Documentation.ClassesInspector
                            Component={TimelineSlotsShowcase}
                            slots={[
                                "root",
                                "item",
                                "bulletWrapper",
                                "bullet",
                                "connector",
                                "content",
                                "date",
                                "title",
                                "description"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="timeline-props"
                        title="Timeline Props"
                        description="The props for the Timeline root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Timeline.Item nodes rendered in sequence."
                                required
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"vertical" | "horizontal"'
                                default='"vertical"'
                                description="Controls timeline direction and item layout."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls bullet sizing, spacing, and typography scale."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls bullet radius."
                            />
                            <Documentation.Props.Content
                                name="lineVariant"
                                type='"solid" | "dashed" | "dotted"'
                                default='"solid"'
                                description="Styles connectors between items."
                            />
                            <Documentation.Props.Content
                                name="active"
                                type="number"
                                default="-1"
                                description="Marks current and previous items as active."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to timeline root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="TimelineClassNames"
                                description="Slot-level class overrides for root, items, bullets, connectors, and text content."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="timeline-item-props"
                        title="Timeline.Item Props"
                        description="The props for each Timeline.Item node."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="date"
                                type="ReactNode"
                                description="Timestamp or date text shown above the title."
                            />
                            <Documentation.Props.Content
                                name="title"
                                type="ReactNode"
                                description="Primary heading for the item."
                            />
                            <Documentation.Props.Content
                                name="bullet"
                                type="ReactNode"
                                description="Custom bullet content such as icon or short label."
                            />
                            <Documentation.Props.Content
                                name="line"
                                type="boolean"
                                default="true"
                                description="Controls whether this item renders its connector."
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Description or body content for the item."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to item wrapper."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
