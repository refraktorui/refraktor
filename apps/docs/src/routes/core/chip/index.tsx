import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Chip,
    type ChipClassNames,
    type ChipGroupClassNames,
    type ChipGroupOrientation,
    type ChipVariant,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/chip/")({
    component: RouteComponent
});

const ChipPlayground = createPlayground(
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
            default: "sm"
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
        selectable: {
            type: "switch",
            label: "Selectable",
            default: true
        },
        selected: {
            type: "switch",
            label: "Selected",
            default: false
        },
        removable: {
            type: "switch",
            label: "Removable",
            default: false
        },
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        },
        label: {
            type: "text",
            label: "Label",
            default: "React"
        }
    },
    {
        code: (props, defaults) => {
            const label = props.label.trim() || "Chip";

            return createSnippet({
                imports: [`import { Chip } from "@refraktor/core";`],
                component: "Chip",
                values: {
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    selectable: props.selectable ? true : undefined,
                    defaultSelected: props.selected ? true : undefined,
                    removable: props.removable ? true : undefined,
                    disabled: props.disabled ? true : undefined
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    selectable: defaults.selectable
                },
                children: label
            });
        }
    }
);

interface ChipSlotsShowcaseProps {
    classNames?: ChipClassNames;
}

function ChipSlotsShowcase({ classNames }: ChipSlotsShowcaseProps) {
    return (
        <Chip
            selectable
            defaultSelected
            removable
            classNames={classNames}
            leftSection={<span aria-hidden>R</span>}
            rightSection={<span aria-hidden>v19</span>}
        >
            React
        </Chip>
    );
}

interface ChipGroupSlotsShowcaseProps {
    classNames?: ChipGroupClassNames;
}

function ChipGroupSlotsShowcase({ classNames }: ChipGroupSlotsShowcaseProps) {
    return (
        <Chip.Group
            defaultValue={["react"]}
            classNames={{ root: classNames?.root }}
        >
            <Chip value="react">React</Chip>
            <Chip value="vue">Vue</Chip>
            <Chip value="svelte">Svelte</Chip>
        </Chip.Group>
    );
}

function RemovableChipsShowcase() {
    const [values, setValues] = useState(["TypeScript", "React", "Design"]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {values.length > 0 ? (
                values.map((item) => (
                    <Chip
                        key={item}
                        removable
                        onRemove={() =>
                            setValues((current) =>
                                current.filter((value) => value !== item)
                            )
                        }
                    >
                        {item}
                    </Chip>
                ))
            ) : (
                <p className="text-sm text-dark-200">All tags removed.</p>
            )}
        </div>
    );
}

function GroupOrientationShowcase({
    orientation
}: {
    orientation: ChipGroupOrientation;
}) {
    return (
        <Chip.Group orientation={orientation} defaultValue={["frontend"]}>
            <Chip value="frontend">Frontend</Chip>
            <Chip value="backend">Backend</Chip>
            <Chip value="design">Design</Chip>
        </Chip.Group>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Chip"
                description="Use interactive, removable tag pills for multi-select filters, selected items, and tag-input experiences where users can toggle or dismiss values."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/chip/chip.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ChipPlayground.Wrapper>
                            <ChipPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    selectable,
                                    selected,
                                    removable,
                                    disabled,
                                    label
                                }) => (
                                    <Chip
                                        key={`${variant}-${size}-${radius}-${selectable}-${selected}-${removable}-${disabled}-${label}`}
                                        variant={variant as ChipVariant}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        selectable={selectable}
                                        defaultSelected={selected}
                                        removable={removable}
                                        onRemove={
                                            removable ? () => undefined : undefined
                                        }
                                        disabled={disabled}
                                    >
                                        {label.trim() || "Chip"}
                                    </Chip>
                                )}
                            </ChipPlayground.Preview>

                            <ChipPlayground.Controls />

                            <ChipPlayground.Code />
                        </ChipPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="group"
                        title="Chip.Group"
                        description="Use Chip.Group for multi-select filter rows with an array of selected values."
                    >
                        <Documentation.Showcase
                            code={`import { Chip } from "@refraktor/core";

export function Demo() {
  return (
    <Chip.Group defaultValue={["react"]}>
      <Chip value="react">React</Chip>
      <Chip value="vue">Vue</Chip>
      <Chip value="svelte">Svelte</Chip>
    </Chip.Group>
  );
}`}
                        >
                            <Chip.Group defaultValue={["react"]}>
                                <Chip value="react">React</Chip>
                                <Chip value="vue">Vue</Chip>
                                <Chip value="svelte">Svelte</Chip>
                            </Chip.Group>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="removable"
                        title="Removable chips"
                        description="Turn chips into dismissible tags for selected items and tag inputs by enabling removable and handling onRemove."
                    >
                        <Documentation.Showcase
                            code={`import { Chip } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [values, setValues] = useState(["TypeScript", "React"]);

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((item) => (
        <Chip
          key={item}
          removable
          onRemove={() =>
            setValues((current) =>
              current.filter((value) => value !== item)
            )
          }
        >
          {item}
        </Chip>
      ))}
    </div>
  );
}`}
                        >
                            <RemovableChipsShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="selected-and-removable"
                        title="Selected and removable"
                        description="Combine selected state and dismiss action when chips represent active filters that users can clear quickly."
                    >
                        <Documentation.Showcase
                            code={`import { Chip } from "@refraktor/core";

export function Demo() {
  return (
    <Chip selectable defaultSelected removable>
      Assigned to me
    </Chip>
  );
}`}
                        >
                            <Chip selectable defaultSelected removable>
                                Assigned to me
                            </Chip>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="group-orientation"
                        title="Group orientation"
                        description="Arrange group chips horizontally for filter bars or vertically for stacked settings panels."
                    >
                        <Documentation.Showcase
                            code={`import { Chip } from "@refraktor/core";

export function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Chip.Group orientation="horizontal" defaultValue={["frontend"]}>
        <Chip value="frontend">Frontend</Chip>
        <Chip value="backend">Backend</Chip>
        <Chip value="design">Design</Chip>
      </Chip.Group>

      <Chip.Group orientation="vertical" defaultValue={["frontend"]}>
        <Chip value="frontend">Frontend</Chip>
        <Chip value="backend">Backend</Chip>
        <Chip value="design">Design</Chip>
      </Chip.Group>
    </div>
  );
}`}
                        >
                            <div className="flex flex-col gap-3">
                                <GroupOrientationShowcase orientation="horizontal" />
                                <GroupOrientationShowcase orientation="vertical" />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="chip-classnames"
                        title="Chip Classnames"
                        description="Hover slot names to highlight matching parts of Chip."
                    >
                        <Documentation.ClassesInspector
                            Component={ChipSlotsShowcase}
                            slots={[
                                "root",
                                "leftSection",
                                "label",
                                "rightSection",
                                "removeButton",
                                "removeIcon"
                            ]}
                        />
                    </Documentation.Section>

                    <Documentation.Section
                        id="chip-group-classnames"
                        title="Chip.Group Classnames"
                        description="Hover slot names to highlight matching parts of Chip.Group."
                    >
                        <Documentation.ClassesInspector
                            Component={ChipGroupSlotsShowcase}
                            slots={["root"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="chip-props"
                        title="Chip Props"
                        description="The props for the Chip component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Value used by Chip.Group to manage multi-select state."
                            />
                            <Documentation.Props.Content
                                name="selected"
                                type="boolean"
                                description="Controlled selected state."
                            />
                            <Documentation.Props.Content
                                name="defaultSelected"
                                type="boolean"
                                description="Initial selected state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onSelectedChange"
                                type="(selected: boolean) => void"
                                description="Called when selected state changes."
                            />
                            <Documentation.Props.Content
                                name="selectable"
                                type="boolean"
                                default="false"
                                description="Enables toggle behavior and keyboard interaction."
                            />
                            <Documentation.Props.Content
                                name="removable"
                                type="boolean"
                                default="false"
                                description="Shows remove button for dismissible chips."
                            />
                            <Documentation.Props.Content
                                name="onRemove"
                                type="(event: React.MouseEvent<HTMLButtonElement>) => void"
                                description="Called when remove button is clicked."
                            />
                            <Documentation.Props.Content
                                name="removeButtonLabel"
                                type="string"
                                description="Accessible label for remove button."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered before chip label."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered after chip label and before remove button."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"sm"'
                                description="Controls chip height, horizontal padding, and typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls border radius on the chip root."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "outline"'
                                default='"default"'
                                description="Controls chip visual style for idle and selected states."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables selection and remove interactions."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the chip root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ChipClassNames"
                                description="Slot-level class overrides for root, leftSection, label, rightSection, removeButton, and removeIcon."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="chip-group-props"
                        title="Chip.Group Props"
                        description="The props for Chip.Group."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Chip items rendered inside the group."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string[]"
                                description="Controlled selected values."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string[]"
                                description="Initial selected values for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string[]) => void"
                                description="Called when selected values change."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Hidden input name used to submit selected values in forms."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                description="Disables all chips in the group."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                description="Shared chip size for children."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                description="Shared chip radius for children."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "outline"'
                                description="Shared chip variant for children."
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"horizontal" | "vertical"'
                                default='"horizontal"'
                                description="Controls group layout direction."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the group root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="ChipGroupClassNames"
                                description="Slot-level class overrides for the group root."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
