import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    PasswordInput,
    type InputFieldClassNames,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/password-input/")({
    component: RouteComponent
});

type PasswordInputVariant = "default" | "filled" | "outline";

const PasswordInputPlayground = createPlayground(
    {
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
        withVisibilityToggle: {
            type: "switch",
            label: "Visibility Toggle",
            default: true
        },
        defaultVisible: {
            type: "switch",
            label: "Default Visible",
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
                imports: [`import { PasswordInput } from "@refraktor/core";`],
                component: "PasswordInput",
                values: {
                    label: "Password",
                    description: "Use at least 8 characters.",
                    placeholder: "Create password",
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    withVisibilityToggle: props.withVisibilityToggle,
                    defaultVisible: props.defaultVisible,
                    disabled: props.disabled
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    withVisibilityToggle: defaults.withVisibilityToggle,
                    defaultVisible: defaults.defaultVisible,
                    disabled: defaults.disabled
                }
            });
        }
    }
);

interface PasswordInputSlotsShowcaseProps {
    classNames?: InputFieldClassNames;
}

function PasswordInputSlotsShowcase({ classNames }: PasswordInputSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-md">
            <PasswordInput
                label="Account password"
                placeholder="Enter password"
                classNames={classNames}
            />
        </div>
    );
}

function ControlledVisibilityShowcase() {
    const [visible, setVisible] = useState(false);

    return (
        <div className="w-full max-w-md space-y-3">
            <PasswordInput
                label="Master password"
                visible={visible}
                onVisibilityChange={setVisible}
                showPasswordLabel="Reveal password"
                hidePasswordLabel="Mask password"
                placeholder="Controlled visibility"
            />
            <p className="text-sm text-dark-200">
                Password is {visible ? "visible" : "hidden"}
            </p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="PasswordInput"
                description="Capture secret text with built-in visibility toggle, accessible labels, and full Input styling and validation support."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/password-input/password-input.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <PasswordInputPlayground.Wrapper>
                            <PasswordInputPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    withVisibilityToggle,
                                    defaultVisible,
                                    disabled
                                }) => (
                                    <div className="w-full max-w-md">
                                        <PasswordInput
                                            key={`${variant}-${size}-${radius}-${withVisibilityToggle}-${defaultVisible}-${disabled}`}
                                            label="Password"
                                            description="Use at least 8 characters."
                                            placeholder="Create password"
                                            variant={variant as PasswordInputVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            withVisibilityToggle={
                                                withVisibilityToggle
                                            }
                                            defaultVisible={defaultVisible}
                                            disabled={disabled}
                                        />
                                    </div>
                                )}
                            </PasswordInputPlayground.Preview>

                            <PasswordInputPlayground.Controls />

                            <PasswordInputPlayground.Code />
                        </PasswordInputPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled-visibility"
                        title="Controlled visibility"
                        description="Control the visible state with visible and onVisibilityChange when you need external state synchronization."
                    >
                        <Documentation.Showcase
                            code={`import { PasswordInput } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [visible, setVisible] = useState(false);

  return (
    <PasswordInput
      label="Master password"
      visible={visible}
      onVisibilityChange={setVisible}
      showPasswordLabel="Reveal password"
      hidePasswordLabel="Mask password"
    />
  );
}`}
                        >
                            <ControlledVisibilityShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="without-toggle"
                        title="Without visibility toggle"
                        description="Disable the built-in toggle and provide your own rightSection content when needed."
                    >
                        <Documentation.Showcase
                            code={`import { PasswordInput } from "@refraktor/core";

export function Demo() {
  return (
    <PasswordInput
      label="One-time password"
      withVisibilityToggle={false}
      rightSection={<span className="text-xs">OTP</span>}
    />
  );
}`}
                        >
                            <div className="w-full max-w-md">
                                <PasswordInput
                                    label="One-time password"
                                    withVisibilityToggle={false}
                                    rightSection={
                                        <span className="text-xs text-dark-200">
                                            OTP
                                        </span>
                                    }
                                    placeholder="Enter one-time password"
                                />
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of PasswordInput."
                    >
                        <Documentation.ClassesInspector
                            Component={PasswordInputSlotsShowcase}
                            slots={["root", "leftSection", "rightSection"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="password-input-props"
                        title="PasswordInput Props"
                        description="Core props for PasswordInput. The component also supports Input props except type."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="withVisibilityToggle"
                                type="boolean"
                                default="true"
                                description="Renders the built-in show/hide password toggle button."
                            />
                            <Documentation.Props.Content
                                name="visible"
                                type="boolean"
                                description="Controlled visibility state for the password value."
                            />
                            <Documentation.Props.Content
                                name="defaultVisible"
                                type="boolean"
                                default="false"
                                description="Initial visibility state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onVisibilityChange"
                                type="(visible: boolean) => void"
                                description="Called whenever visibility toggles."
                            />
                            <Documentation.Props.Content
                                name="showPasswordLabel"
                                type="string"
                                default='"Show password"'
                                description="Accessible label used when password is currently hidden."
                            />
                            <Documentation.Props.Content
                                name="hidePasswordLabel"
                                type="string"
                                default='"Hide password"'
                                description="Accessible label used when password is currently visible."
                            />
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label content displayed above the field."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered below the label."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error content rendered below the field."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls input field visual style."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls height, spacing, and text sizing."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius for the input field container."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables both input typing and visibility toggle interaction."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Custom right-side content rendered next to the visibility toggle when enabled."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the field root."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="InputFieldClassNames"
                                description="Slot-level class overrides for root, leftSection, and rightSection."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
