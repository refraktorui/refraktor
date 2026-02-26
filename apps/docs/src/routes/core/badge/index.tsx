import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Badge,
    type BadgeClassNames,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/badge/")({
    component: RouteComponent
});

type BadgeVariant = "default" | "outline";

const BadgePlayground = createPlayground(
    {
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "outline"] as const,
            default: "default"
        },
        size: {
            type: "select",
            label: "Size",
            options: ["xs", "sm", "md", "lg", "xl"] as const,
            default: "xs"
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
        label: {
            type: "text",
            label: "Label",
            default: "In Progress"
        }
    },
    {
        code: (props, defaults) => {
            const content = props.label.trim() || "Badge";

            return createSnippet({
                imports: [`import { Badge } from "@refraktor/core";`],
                component: "Badge",
                values: {
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius
                },
                children: content
            });
        }
    }
);

interface BadgeSlotsShowcaseProps {
    classNames?: BadgeClassNames;
}

function BadgeSlotsShowcase({ classNames }: BadgeSlotsShowcaseProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Badge classNames={{ root: classNames?.root }}>Default</Badge>
            <Badge variant="outline" classNames={{ root: classNames?.root }}>
                Outline
            </Badge>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Badge"
                description="Highlight metadata, status, and compact labels in a lightweight visual container with size, radius, and variant controls."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/badge/badge.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <BadgePlayground.Wrapper>
                            <BadgePlayground.Preview>
                                {({ variant, size, radius, label }) => (
                                    <Badge
                                        variant={variant as BadgeVariant}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                    >
                                        {label.trim() || "Badge"}
                                    </Badge>
                                )}
                            </BadgePlayground.Preview>

                            <BadgePlayground.Controls />

                            <BadgePlayground.Code />
                        </BadgePlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="variants"
                        title="Variants"
                        description="Use default for filled emphasis and outline for a more subtle treatment."
                    >
                        <Documentation.Showcase
                            code={`import { Badge } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge>Stable</Badge>
      <Badge variant="outline">Beta</Badge>
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-2">
                                <Badge>Stable</Badge>
                                <Badge variant="outline">Beta</Badge>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="pill-radius"
                        title="Pill radius"
                        description="Set radius to full for rounded chips used in tag and category UIs."
                    >
                        <Documentation.Showcase
                            code={`import { Badge } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge radius="full">Design</Badge>
      <Badge radius="full" variant="outline">Engineering</Badge>
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-2">
                                <Badge radius="full">Design</Badge>
                                <Badge radius="full" variant="outline">
                                    Engineering
                                </Badge>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="status-dot"
                        title="Status dot"
                        description="Compose inline content to show small indicators like activity or environment state."
                    >
                        <Documentation.Showcase
                            code={`import { Badge } from "@refraktor/core";

export function Demo() {
  return (
    <Badge className="gap-1.5">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-emerald-500"
      />
      Live
    </Badge>
  );
}`}
                        >
                            <Badge className="gap-1.5">
                                <span
                                    aria-hidden
                                    className="size-1.5 rounded-full bg-emerald-500"
                                />
                                Live
                            </Badge>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Badge."
                    >
                        <Documentation.ClassesInspector
                            Component={BadgeSlotsShowcase}
                            slots={["root"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="badge-props"
                        title="Badge Props"
                        description="The props for the Badge component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Badge label or custom inline content."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "outline"'
                                default='"default"'
                                description="Controls the visual style of the badge."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"xs"'
                                description="Controls the badge padding and font size."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the root element."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="BadgeClassNames"
                                description="Slot-level class overrides for the badge."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
