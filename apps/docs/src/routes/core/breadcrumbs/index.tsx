import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Breadcrumbs,
    type BreadcrumbsClassNames,
    type BreadcrumbsItem,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/breadcrumbs/")({
    component: RouteComponent
});

type BreadcrumbsSeparator = "chevron" | "slash" | "pipe";

const playgroundItems: BreadcrumbsItem[] = [
    { label: "Home", href: "#home" },
    { label: "Workspace", href: "#workspace" },
    { label: "Projects", href: "#projects" },
    { label: "Refraktor", href: "#refraktor" },
    { label: "Components", href: "#components" },
    { label: "Breadcrumbs" }
];

const itemsSnippet = `[
    { label: "Home", href: "#home" },
    { label: "Workspace", href: "#workspace" },
    { label: "Projects", href: "#projects" },
    { label: "Refraktor", href: "#refraktor" },
    { label: "Components", href: "#components" },
    { label: "Breadcrumbs" }
  ]`;

function resolveSeparator(separator: BreadcrumbsSeparator) {
    if (separator === "slash") {
        return "/";
    }

    if (separator === "pipe") {
        return "|";
    }

    return undefined;
}

const BreadcrumbsPlayground = createPlayground(
    {
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
        maxItems: {
            type: "number",
            label: "Max Items",
            min: 0,
            max: 6,
            default: 4
        },
        itemsBeforeCollapse: {
            type: "number",
            label: "Items Before",
            min: 0,
            max: 4,
            default: 1
        },
        itemsAfterCollapse: {
            type: "number",
            label: "Items After",
            min: 0,
            max: 4,
            default: 1
        },
        separator: {
            type: "segmented",
            label: "Separator",
            options: [
                { value: "chevron", label: "Chevron" },
                { value: "slash", label: "Slash" },
                { value: "pipe", label: "Pipe" }
            ] as const,
            default: "chevron"
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.maxItems !== defaults.maxItems
                    ? `maxItems={${props.maxItems}}`
                    : null,
                props.itemsBeforeCollapse !== defaults.itemsBeforeCollapse
                    ? `itemsBeforeCollapse={${props.itemsBeforeCollapse}}`
                    : null,
                props.itemsAfterCollapse !== defaults.itemsAfterCollapse
                    ? `itemsAfterCollapse={${props.itemsAfterCollapse}}`
                    : null,
                props.separator !== defaults.separator
                    ? props.separator === "slash"
                        ? 'separator="/"'
                        : 'separator="|"'
                    : null
            ].filter((value): value is string => value !== null);

            const additionalProps =
                rootProps.length > 0
                    ? `\n${rootProps.map((prop) => `  ${prop}`).join("\n")}`
                    : "";

            return createSnippet({
                imports: [`import { Breadcrumbs } from "@refraktor/core";`],
                jsx: `<Breadcrumbs\n  items={${itemsSnippet}}${additionalProps}\n/>`
            });
        }
    }
);

interface BreadcrumbsSlotsShowcaseProps {
    classNames?: BreadcrumbsClassNames;
}

function BreadcrumbsSlotsShowcase({
    classNames
}: BreadcrumbsSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-2xl">
            <Breadcrumbs
                items={playgroundItems}
                maxItems={3}
                classNames={classNames}
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Breadcrumbs"
                description="Represent hierarchical navigation paths with automatic collapsing for long trails, custom separators, and full accessibility labels."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/breadcrumbs/breadcrumbs.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <BreadcrumbsPlayground.Wrapper>
                            <BreadcrumbsPlayground.Preview>
                                {({
                                    size,
                                    radius,
                                    maxItems,
                                    itemsBeforeCollapse,
                                    itemsAfterCollapse,
                                    separator
                                }) => (
                                    <Breadcrumbs
                                        key={`${size}-${radius}-${maxItems}-${itemsBeforeCollapse}-${itemsAfterCollapse}-${separator}`}
                                        items={playgroundItems}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        maxItems={maxItems}
                                        itemsBeforeCollapse={
                                            itemsBeforeCollapse
                                        }
                                        itemsAfterCollapse={itemsAfterCollapse}
                                        separator={resolveSeparator(
                                            separator as BreadcrumbsSeparator
                                        )}
                                    />
                                )}
                            </BreadcrumbsPlayground.Preview>

                            <BreadcrumbsPlayground.Controls />

                            <BreadcrumbsPlayground.Code />
                        </BreadcrumbsPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="collapsed-path"
                        title="Collapsed path"
                        description="Set maxItems to keep long breadcrumb trails compact while preserving access to the full path."
                    >
                        <Documentation.Showcase
                            code={`import { Breadcrumbs } from "@refraktor/core";

export function Demo() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#home" },
        { label: "Workspace", href: "#workspace" },
        { label: "Projects", href: "#projects" },
        { label: "Refraktor", href: "#refraktor" },
        { label: "Components", href: "#components" },
        { label: "Breadcrumbs" }
      ]}
      maxItems={4}
    />
  );
}`}
                        >
                            <Breadcrumbs items={playgroundItems} maxItems={4} />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="collapsed-window"
                        title="Collapsed window"
                        description="Tune which items stay visible around the collapsed segment with itemsBeforeCollapse and itemsAfterCollapse."
                    >
                        <Documentation.Showcase
                            code={`import { Breadcrumbs } from "@refraktor/core";

export function Demo() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#home" },
        { label: "Workspace", href: "#workspace" },
        { label: "Projects", href: "#projects" },
        { label: "Refraktor", href: "#refraktor" },
        { label: "Components", href: "#components" },
        { label: "Breadcrumbs" }
      ]}
      maxItems={4}
      itemsBeforeCollapse={2}
      itemsAfterCollapse={2}
    />
  );
}`}
                        >
                            <Breadcrumbs
                                items={playgroundItems}
                                maxItems={4}
                                itemsBeforeCollapse={2}
                                itemsAfterCollapse={2}
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-separator"
                        title="Custom separator"
                        description="Provide any React node to separator when your project needs a different visual style than chevrons."
                    >
                        <Documentation.Showcase
                            code={`import { Breadcrumbs } from "@refraktor/core";

export function Demo() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#home" },
        { label: "Components", href: "#components" },
        { label: "Breadcrumbs" }
      ]}
      separator="/"
    />
  );
}`}
                        >
                            <Breadcrumbs
                                items={[
                                    { label: "Home", href: "#home" },
                                    {
                                        label: "Components",
                                        href: "#components"
                                    },
                                    { label: "Breadcrumbs" }
                                ]}
                                separator="/"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Breadcrumbs."
                    >
                        <Documentation.ClassesInspector
                            Component={BreadcrumbsSlotsShowcase}
                            slots={[
                                "root",
                                "list",
                                "item",
                                "link",
                                "current",
                                "separator",
                                "collapse"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="breadcrumbs-props"
                        title="Breadcrumbs Props"
                        description="The props for the Breadcrumbs component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="items"
                                type="BreadcrumbsItem[]"
                                description="Breadcrumb items in hierarchical order."
                                required
                            />
                            <Documentation.Props.Content
                                name="maxItems"
                                type="number"
                                default="4"
                                description="Collapses items when the amount exceeds this number. Use 0 to disable collapsing."
                            />
                            <Documentation.Props.Content
                                name="itemsBeforeCollapse"
                                type="number"
                                default="1"
                                description="Number of items kept visible before the collapsed section."
                            />
                            <Documentation.Props.Content
                                name="itemsAfterCollapse"
                                type="number"
                                default="1"
                                description="Number of items kept visible after the collapsed section."
                            />
                            <Documentation.Props.Content
                                name="expanded"
                                type="boolean"
                                description="Controlled collapse state."
                            />
                            <Documentation.Props.Content
                                name="defaultExpanded"
                                type="boolean"
                                default="false"
                                description="Initial collapse state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onExpandedChange"
                                type="(expanded: boolean) => void"
                                description="Called when collapse state changes."
                            />
                            <Documentation.Props.Content
                                name="expandLabel"
                                type="string"
                                default='"Show full breadcrumb path"'
                                description="Accessible label for the collapse button."
                            />
                            <Documentation.Props.Content
                                name="separator"
                                type="ReactNode"
                                description="Custom separator rendered between breadcrumb items."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls breadcrumb text and separator sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on the collapse button."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root nav element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="BreadcrumbsClassNames"
                                description="Slot-level class overrides for root, list, item, link, current, separator, and collapse."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
