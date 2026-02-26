import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    PinInput,
    type PinInputCharacterSet,
    type PinInputClassNames,
    type PinInputTransform,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/pin-input/")({
    component: RouteComponent
});

type PinInputVariant = "default" | "filled" | "outline";

const PinInputPlayground = createPlayground(
    {
        length: {
            type: "number",
            label: "Length",
            min: 4,
            max: 8,
            step: 1,
            default: 6
        },
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "filled", "outline"] as const,
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
            default: "default"
        },
        characterSet: {
            type: "select",
            label: "Character Set",
            options: ["numeric", "alphabetic", "alphanumeric", "all"] as const,
            default: "alphanumeric"
        },
        transform: {
            type: "segmented",
            label: "Transform",
            options: ["none", "uppercase", "lowercase"] as const,
            default: "none"
        },
        mask: {
            type: "switch",
            label: "Mask",
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
            return createSnippet({
                imports: [`import { PinInput } from "@refraktor/core";`],
                component: "PinInput",
                values: {
                    label: "Verification code",
                    description: "Paste or type your one-time passcode.",
                    length: props.length,
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    characterSet: props.characterSet,
                    transform: props.transform,
                    mask: props.mask,
                    disabled: props.disabled
                },
                defaults: {
                    length: defaults.length,
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    characterSet: defaults.characterSet,
                    transform: defaults.transform,
                    mask: defaults.mask,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface PinInputSlotsShowcaseProps {
    classNames?: PinInputClassNames;
}

function PinInputSlotsShowcase({ classNames }: PinInputSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <PinInput
                label="2FA code"
                length={6}
                characterSet="alphanumeric"
                classNames={classNames}
            />
        </div>
    );
}

function ControlledPinInputShowcase() {
    const [value, setValue] = useState("");

    return (
        <div className="w-full max-w-md space-y-3">
            <PinInput
                label="Controlled value"
                value={value}
                onChange={setValue}
                length={6}
                characterSet="alphanumeric"
                transform="uppercase"
            />
            <p className="text-sm text-dark-200">
                Current value: {value || "-"}
            </p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="PinInput"
                description="Collect verification codes with single-character cells, auto focus flow, paste support, masking, and configurable character filtering."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/pin-input/pin-input.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <PinInputPlayground.Wrapper>
                            <PinInputPlayground.Preview>
                                {({
                                    length,
                                    variant,
                                    size,
                                    radius,
                                    characterSet,
                                    transform,
                                    mask,
                                    disabled
                                }) => (
                                    <div className="w-full max-w-md">
                                        <PinInput
                                            key={`${length}-${variant}-${size}-${radius}-${characterSet}-${transform}-${mask}-${disabled}`}
                                            label="Verification code"
                                            description="Paste or type your one-time passcode."
                                            length={length}
                                            variant={variant as PinInputVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            characterSet={
                                                characterSet as PinInputCharacterSet
                                            }
                                            transform={
                                                transform as PinInputTransform
                                            }
                                            mask={mask}
                                            disabled={disabled}
                                        />
                                    </div>
                                )}
                            </PinInputPlayground.Preview>

                            <PinInputPlayground.Controls />

                            <PinInputPlayground.Code />
                        </PinInputPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="character-modes"
                        title="Character modes"
                        description="Use characterSet for built-in filtering and characterPattern for custom rules like hex-only or coupon formats."
                    >
                        <Documentation.Showcase
                            code={`import { PinInput } from "@refraktor/core";

export function Demo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PinInput label="Numeric OTP" characterSet="numeric" length={6} />
      <PinInput label="Alphanumeric" characterSet="alphanumeric" length={6} />
    </div>
  );
}`}
                        >
                            <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                                <PinInput
                                    label="Numeric OTP"
                                    characterSet="numeric"
                                    length={6}
                                />
                                <PinInput
                                    label="Alphanumeric"
                                    characterSet="alphanumeric"
                                    length={6}
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="custom-pattern"
                        title="Custom filtering"
                        description="Provide characterPattern to support specialized formats and transform to normalize casing."
                    >
                        <Documentation.Showcase
                            code={`import { PinInput } from "@refraktor/core";

export function Demo() {
  return (
    <PinInput
      label="Recovery key"
      length={8}
      characterPattern={/[A-F0-9]/}
      transform="uppercase"
      placeholder="-"
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <PinInput
                                    label="Recovery key"
                                    length={8}
                                    characterPattern={/[A-F0-9]/}
                                    transform="uppercase"
                                    placeholder="-"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="masking"
                        title="Masking"
                        description="Enable mask when entering sensitive 2FA backup codes while keeping the submitted value intact."
                    >
                        <Documentation.Showcase
                            code={`import { PinInput } from "@refraktor/core";

export function Demo() {
  return (
    <PinInput
      label="Backup code"
      length={8}
      characterSet="alphanumeric"
      mask
      name="backupCode"
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <PinInput
                                    label="Backup code"
                                    length={8}
                                    characterSet="alphanumeric"
                                    mask
                                    name="backupCode"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled value"
                        description="Use value and onChange to integrate with external form state and validation workflows."
                    >
                        <Documentation.Showcase
                            code={`import { PinInput } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [value, setValue] = useState("");

  return (
    <PinInput
      value={value}
      onChange={setValue}
      length={6}
      characterSet="alphanumeric"
      transform="uppercase"
    />
  );
}`}
                        >
                            <ControlledPinInputShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of PinInput."
                    >
                        <Documentation.ClassesInspector
                            Component={PinInputSlotsShowcase}
                            slots={["root", "cell"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="pin-input-props"
                        title="PinInput Props"
                        description="Core props for PinInput. The component also supports common Input wrapper and field styling props unless overridden below."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="length"
                                type="number"
                                default="6"
                                description="Number of character cells rendered."
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Controlled code value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string"
                                description="Initial code value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string) => void"
                                description="Called whenever the joined code changes."
                            />
                            <Documentation.Props.Content
                                name="onComplete"
                                type="(value: string) => void"
                                description="Called when all cells are filled with valid characters."
                            />
                            <Documentation.Props.Content
                                name="characterSet"
                                type='"numeric" | "alphabetic" | "alphanumeric" | "all"'
                                default='"numeric"'
                                description="Built-in character filtering mode."
                            />
                            <Documentation.Props.Content
                                name="characterPattern"
                                type="RegExp"
                                description="Custom character filter, useful for formats like hexadecimal or coupon tokens."
                            />
                            <Documentation.Props.Content
                                name="transform"
                                type='"none" | "uppercase" | "lowercase"'
                                default='"none"'
                                description="Optional per-character normalization before storing values."
                            />
                            <Documentation.Props.Content
                                name="mask"
                                type="boolean"
                                default="false"
                                description="Masks the visible characters in each cell."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Adds a hidden input so forms submit the joined code value."
                            />
                            <Documentation.Props.Content
                                name="ariaLabelPrefix"
                                type="string"
                                default='"Character"'
                                description="Accessible prefix used to label each input cell."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls the visual style of each cell."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls cell size and text sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius on each cell."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="PinInputClassNames"
                                description="Slot-level class overrides for root and cell."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
