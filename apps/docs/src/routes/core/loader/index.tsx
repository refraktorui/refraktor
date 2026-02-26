import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import { Loader } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/loader/")({
    component: RouteComponent
});

const LoaderPlayground = createPlayground(
    {
        size: {
            type: "number",
            label: "Size",
            min: 12,
            max: 96,
            step: 2,
            default: 32
        },
        speed: {
            type: "number",
            label: "Speed",
            min: 0.2,
            max: 3,
            step: 0.1,
            default: 1
        },
        stroke: {
            type: "number",
            label: "Stroke",
            min: 1,
            max: 8,
            step: 0.5,
            default: 3
        },
        strokeLength: {
            type: "number",
            label: "Stroke Length",
            min: 0.1,
            max: 1,
            step: 0.05,
            default: 0.6
        },
        bgOpacity: {
            type: "number",
            label: "Background Opacity",
            min: 0,
            max: 1,
            step: 0.05,
            default: 0.1
        }
    },
    {
        code: (props, defaults) => {
            return createSnippet({
                imports: [`import { Loader } from "@refraktor/core";`],
                component: "Loader",
                values: {
                    size: props.size,
                    speed: props.speed,
                    stroke: props.stroke,
                    strokeLength: props.strokeLength,
                    bgOpacity: props.bgOpacity
                },
                defaults: {
                    size: defaults.size,
                    speed: defaults.speed,
                    stroke: defaults.stroke,
                    strokeLength: defaults.strokeLength,
                    bgOpacity: defaults.bgOpacity
                }
            });
        }
    }
);

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Loader"
                description="Show circular loading feedback with configurable size, speed, stroke weight, and color."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/loader/loader.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <LoaderPlayground.Wrapper>
                            <LoaderPlayground.Preview>
                                {({
                                    size,
                                    speed,
                                    stroke,
                                    strokeLength,
                                    bgOpacity
                                }) => (
                                    <Loader
                                        key={`${size}-${speed}-${stroke}-${strokeLength}-${bgOpacity}`}
                                        size={size}
                                        speed={speed}
                                        stroke={stroke}
                                        strokeLength={strokeLength}
                                        bgOpacity={bgOpacity}
                                    />
                                )}
                            </LoaderPlayground.Preview>

                            <LoaderPlayground.Controls />

                            <LoaderPlayground.Code />
                        </LoaderPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="sizes"
                        title="Sizes"
                        description="Use smaller loaders inline with text or larger ones for section-level loading states."
                    >
                        <Documentation.Showcase
                            code={`import { Loader } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Loader size={16} />
      <Loader size={24} />
      <Loader size={32} />
      <Loader size={48} />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-4">
                                <Loader size={16} />
                                <Loader size={24} />
                                <Loader size={32} />
                                <Loader size={48} />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="color-and-speed"
                        title="Color and speed"
                        description="Tune color and speed to match emphasis and loading intensity in your UI."
                    >
                        <Documentation.Showcase
                            code={`import { Loader } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Loader color="#22c55e" speed={0.7} />
      <Loader color="#f59e0b" speed={1} />
      <Loader color="#ef4444" speed={1.5} />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-4">
                                <Loader color="#22c55e" speed={0.7} />
                                <Loader color="#f59e0b" speed={1} />
                                <Loader color="#ef4444" speed={1.5} />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="stroke"
                        title="Stroke style"
                        description="Adjust stroke and strokeLength to change the visual weight and arc length of the spinner."
                    >
                        <Documentation.Showcase
                            code={`import { Loader } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Loader stroke={2} strokeLength={0.45} />
      <Loader stroke={3} strokeLength={0.6} />
      <Loader stroke={5} strokeLength={0.8} />
    </div>
  );
}`}
                        >
                            <div className="flex items-center gap-4">
                                <Loader stroke={2} strokeLength={0.45} />
                                <Loader stroke={3} strokeLength={0.6} />
                                <Loader stroke={5} strokeLength={0.8} />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="loader-props"
                        title="Loader Props"
                        description="The props for the Loader component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="size"
                                type="number"
                                default="32"
                                description="Controls the width and height of the loader in pixels."
                            />
                            <Documentation.Props.Content
                                name="color"
                                type="string"
                                default='"var(--refraktor-primary)"'
                                description="Sets the stroke color for both spinner arcs."
                            />
                            <Documentation.Props.Content
                                name="speed"
                                type="number"
                                default="1"
                                description="Animation duration in seconds. Lower values spin faster."
                            />
                            <Documentation.Props.Content
                                name="stroke"
                                type="number"
                                default="3"
                                description="Stroke width of the spinner arcs."
                            />
                            <Documentation.Props.Content
                                name="strokeLength"
                                type="number"
                                default="0.6"
                                description="Visible arc length ratio from 0 to 1."
                            />
                            <Documentation.Props.Content
                                name="bgOpacity"
                                type="number"
                                default="0.1"
                                description="Opacity of the background arc from 0 to 1."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
