import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    ColorSwatch,
    type ColorSwatchClassNames,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/color-swatch/")({
    component: RouteComponent
});

const ColorSwatchPlayground = createPlayground(
    {
        color: {
            type: "text",
            label: "Color",
            default: "rgba(79, 70, 229, 0.8)"
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
            default: "default"
        },
        showContent: {
            type: "switch",
            label: "Show Content",
            default: false
        },
        content: {
            type: "text",
            label: "Content",
            default: "A"
        }
    },
    {
        code: (props, defaults) => {
            const content = props.content.trim() || "A";

            return createSnippet({
                imports: [`import { ColorSwatch } from "@refraktor/core";`],
                component: "ColorSwatch",
                values: {
                    color: props.color,
                    size: props.size,
                    radius: props.radius
                },
                defaults: {
                    color: defaults.color,
                    size: defaults.size,
                    radius: defaults.radius
                },
                children: props.showContent ? content : undefined
            });
        }
    }
);

interface ColorSwatchSlotsShowcaseProps {
    classNames?: ColorSwatchClassNames;
}

function ColorSwatchSlotsShowcase({ classNames }: ColorSwatchSlotsShowcaseProps) {
    return (
        <ColorSwatch
            color="rgba(59, 130, 246, 0.75)"
            size="xl"
            classNames={classNames}
        >
            <span className="text-xs font-semibold text-white">A</span>
        </ColorSwatch>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="ColorSwatch"
                description="Render compact color previews with transparency support, size controls, and optional centered content overlays."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/color-swatch/color-swatch.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ColorSwatchPlayground.Wrapper>
                            <ColorSwatchPlayground.Preview>
                                {({
                                    color,
                                    size,
                                    radius,
                                    showContent,
                                    content
                                }) => (
                                    <ColorSwatch
                                        key={`${color}-${size}-${radius}-${showContent}-${content}`}
                                        color={color.trim() || "transparent"}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                    >
                                        {showContent ? (
                                            <span className="text-xs font-semibold text-white">
                                                {content.trim() || "A"}
                                            </span>
                                        ) : null}
                                    </ColorSwatch>
                                )}
                            </ColorSwatchPlayground.Preview>

                            <ColorSwatchPlayground.Controls />

                            <ColorSwatchPlayground.Code />
                        </ColorSwatchPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="transparency"
                        title="Transparency"
                        description="Alpha colors automatically render over a checker grid so translucent values remain easy to inspect."
                    >
                        <Documentation.Showcase
                            code={`import { ColorSwatch } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-2">
      <ColorSwatch color="rgba(239, 68, 68, 0.35)" />
      <ColorSwatch color="rgba(34, 197, 94, 0.5)" />
      <ColorSwatch color="rgba(59, 130, 246, 0.65)" />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-2">
                                <ColorSwatch color="rgba(239, 68, 68, 0.35)" />
                                <ColorSwatch color="rgba(34, 197, 94, 0.5)" />
                                <ColorSwatch color="rgba(59, 130, 246, 0.65)" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="with-content"
                        title="With content"
                        description="Pass children to render centered labels, initials, or symbols inside the swatch."
                    >
                        <Documentation.Showcase
                            code={`import { ColorSwatch } from "@refraktor/core";

export function Demo() {
  return (
    <ColorSwatch color="#0f172a" size="lg">
      <span className="text-xs font-semibold text-white">AA</span>
    </ColorSwatch>
  );
}`}
                        >
                            <ColorSwatch color="#0f172a" size="lg">
                                <span className="text-xs font-semibold text-white">
                                    AA
                                </span>
                            </ColorSwatch>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sizes"
                        title="Sizes"
                        description="Use size presets from xs to xl for compact palette chips or larger selection targets."
                    >
                        <Documentation.Showcase
                            code={`import { ColorSwatch } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-2">
      <ColorSwatch size="xs" color="#ef4444" />
      <ColorSwatch size="sm" color="#f97316" />
      <ColorSwatch size="md" color="#f59e0b" />
      <ColorSwatch size="lg" color="#10b981" />
      <ColorSwatch size="xl" color="#3b82f6" />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-2">
                                <ColorSwatch size="xs" color="#ef4444" />
                                <ColorSwatch size="sm" color="#f97316" />
                                <ColorSwatch size="md" color="#f59e0b" />
                                <ColorSwatch size="lg" color="#10b981" />
                                <ColorSwatch size="xl" color="#3b82f6" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of ColorSwatch."
                    >
                        <Documentation.ClassesInspector
                            Component={ColorSwatchSlotsShowcase}
                            slots={["root", "grid", "color", "content"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="color-swatch-props"
                        title="ColorSwatch Props"
                        description="The props for the ColorSwatch component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="color"
                                type="string"
                                default='"transparent"'
                                description="Swatch color value such as hex, rgb, rgba, hsl, or CSS gradients."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls swatch dimensions."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the swatch root element."
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Optional content rendered in the center of the swatch."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ColorSwatchClassNames"
                                description="Slot-level class overrides for root, grid, color, and content."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
