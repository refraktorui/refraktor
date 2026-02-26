import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Tabs as CoreTabs,
    type RefraktorRadius,
    type RefraktorSize,
    type TabsActivationMode,
    type TabsClassNames,
    type TabsOrientation,
    type TabsVariant
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/tabs/")({
    component: RouteComponent
});

const TabsPlayground = createPlayground(
    {
        orientation: {
            type: "segmented",
            label: "Orientation",
            options: ["horizontal", "vertical"] as const,
            default: "horizontal"
        },
        activationMode: {
            type: "segmented",
            label: "Activation",
            options: ["automatic", "manual"] as const,
            default: "automatic"
        },
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["underline", "pills"] as const,
            default: "underline"
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
        loop: {
            type: "switch",
            label: "Loop",
            default: true
        },
        keepMounted: {
            type: "switch",
            label: "Keep Mounted",
            default: false
        },
        disableSecurity: {
            type: "switch",
            label: "Disable Security",
            default: false
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                'defaultValue="account"',
                props.orientation !== defaults.orientation
                    ? `orientation="${props.orientation}"`
                    : null,
                props.activationMode !== defaults.activationMode
                    ? `activationMode="${props.activationMode}"`
                    : null,
                props.variant !== defaults.variant
                    ? `variant="${props.variant}"`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                props.loop !== defaults.loop
                    ? props.loop
                        ? "loop"
                        : "loop={false}"
                    : null,
                props.keepMounted ? "keepMounted" : null
            ].filter((value): value is string => value !== null);

            const rootPropsBlock = rootProps.map((prop) => `  ${prop}`).join("\n");
            const securityTab = props.disableSecurity
                ? '      <Tabs.Tab value="security" disabled>Security</Tabs.Tab>'
                : '      <Tabs.Tab value="security">Security</Tabs.Tab>';

            return createSnippet({
                imports: [`import { Tabs } from "@refraktor/core";`],
                jsx: `<Tabs
${rootPropsBlock}
>
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
${securityTab}
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="account">Account settings</Tabs.Panel>
  <Tabs.Panel value="security">Security settings</Tabs.Panel>
  <Tabs.Panel value="billing">Billing settings</Tabs.Panel>
</Tabs>`
            });
        }
    }
);

interface TabsSlotsShowcaseProps {
    classNames?: TabsClassNames;
}

function TabsSlotsShowcase({ classNames }: TabsSlotsShowcaseProps) {
    return (
        <div className="w-full max-w-2xl">
            <CoreTabs defaultValue="account" classNames={classNames}>
                <CoreTabs.List>
                    <CoreTabs.Tab value="account">Account</CoreTabs.Tab>
                    <CoreTabs.Tab value="security">Security</CoreTabs.Tab>
                </CoreTabs.List>

                <CoreTabs.Panel value="account">Account panel</CoreTabs.Panel>
                <CoreTabs.Panel value="security">Security panel</CoreTabs.Panel>
            </CoreTabs>
        </div>
    );
}

function ControlledTabsShowcase() {
    const [value, setValue] = useState("account");

    return (
        <div className="w-full max-w-2xl space-y-3">
            <CoreTabs value={value} onChange={setValue} variant="pills">
                <CoreTabs.List>
                    <CoreTabs.Tab value="account">Account</CoreTabs.Tab>
                    <CoreTabs.Tab value="security">Security</CoreTabs.Tab>
                    <CoreTabs.Tab value="billing">Billing</CoreTabs.Tab>
                </CoreTabs.List>

                <CoreTabs.Panel value="account">Account panel</CoreTabs.Panel>
                <CoreTabs.Panel value="security">Security panel</CoreTabs.Panel>
                <CoreTabs.Panel value="billing">Billing panel</CoreTabs.Panel>
            </CoreTabs>

            <p className="text-sm text-dark-200">Active tab: {value}</p>
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Tabs"
                description="Organize related content into keyboard-accessible tab panels with horizontal or vertical layouts and manual or automatic activation modes."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/tabs/tabs.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <TabsPlayground.Wrapper>
                            <TabsPlayground.Preview>
                                {({
                                    orientation,
                                    activationMode,
                                    variant,
                                    size,
                                    radius,
                                    loop,
                                    keepMounted,
                                    disableSecurity
                                }) => (
                                    <div className="w-full max-w-2xl">
                                        <CoreTabs
                                            key={`${orientation}-${activationMode}-${variant}-${size}-${radius}-${loop}-${keepMounted}-${disableSecurity}`}
                                            defaultValue="account"
                                            orientation={
                                                orientation as TabsOrientation
                                            }
                                            activationMode={
                                                activationMode as TabsActivationMode
                                            }
                                            variant={variant as TabsVariant}
                                            size={size as RefraktorSize}
                                            radius={radius as RefraktorRadius}
                                            loop={loop}
                                            keepMounted={keepMounted}
                                        >
                                            <CoreTabs.List>
                                                <CoreTabs.Tab value="account">
                                                    Account
                                                </CoreTabs.Tab>
                                                <CoreTabs.Tab
                                                    value="security"
                                                    disabled={disableSecurity}
                                                >
                                                    Security
                                                </CoreTabs.Tab>
                                                <CoreTabs.Tab value="billing">
                                                    Billing
                                                </CoreTabs.Tab>
                                            </CoreTabs.List>

                                            <CoreTabs.Panel value="account">
                                                Manage profile and preferences.
                                            </CoreTabs.Panel>
                                            <CoreTabs.Panel value="security">
                                                Configure passwords and 2FA.
                                            </CoreTabs.Panel>
                                            <CoreTabs.Panel value="billing">
                                                Review plan and invoices.
                                            </CoreTabs.Panel>
                                        </CoreTabs>
                                    </div>
                                )}
                            </TabsPlayground.Preview>

                            <TabsPlayground.Controls />

                            <TabsPlayground.Code />
                        </TabsPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="controlled"
                        title="Controlled mode"
                        description="Use value and onChange when tab state must synchronize with routing, analytics, or external controls."
                    >
                        <Documentation.Showcase
                            code={`import { Tabs } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [value, setValue] = useState("account");

  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="account">Account panel</Tabs.Panel>
      <Tabs.Panel value="security">Security panel</Tabs.Panel>
    </Tabs>
  );
}`}
                        >
                            <ControlledTabsShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="vertical"
                        title="Vertical layout"
                        description="Set orientation to vertical for side-navigation style settings pages and dashboards."
                    >
                        <Documentation.Showcase
                            code={`import { Tabs } from "@refraktor/core";

export function Demo() {
  return (
    <Tabs defaultValue="profile" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile">Profile content</Tabs.Panel>
      <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
    </Tabs>
  );
}`}
                        >
                            <div className="w-full max-w-2xl">
                                <CoreTabs defaultValue="profile" orientation="vertical">
                                    <CoreTabs.List>
                                        <CoreTabs.Tab value="profile">
                                            Profile
                                        </CoreTabs.Tab>
                                        <CoreTabs.Tab value="notifications">
                                            Notifications
                                        </CoreTabs.Tab>
                                    </CoreTabs.List>

                                    <CoreTabs.Panel value="profile">
                                        Profile content
                                    </CoreTabs.Panel>
                                    <CoreTabs.Panel value="notifications">
                                        Notifications content
                                    </CoreTabs.Panel>
                                </CoreTabs>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of Tabs."
                    >
                        <Documentation.ClassesInspector
                            Component={TabsSlotsShowcase}
                            slots={["root", "list", "tab", "panel"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="tabs-props"
                        title="Tabs Props"
                        description="The props for the Tabs root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Tabs.List, Tabs.Tab, and Tabs.Panel structure."
                                required
                            />
                            <Documentation.Props.Content
                                name="value"
                                type="string"
                                description="Controlled active tab value."
                            />
                            <Documentation.Props.Content
                                name="defaultValue"
                                type="string"
                                description="Initial active tab value for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(value: string) => void"
                                description="Called when active tab changes."
                            />
                            <Documentation.Props.Content
                                name="orientation"
                                type='"horizontal" | "vertical"'
                                default='"horizontal"'
                                description="Controls tablist and panel layout direction."
                            />
                            <Documentation.Props.Content
                                name="activationMode"
                                type='"automatic" | "manual"'
                                default='"automatic"'
                                description="Determines whether focus changes activate tabs immediately or on Enter/Space."
                            />
                            <Documentation.Props.Content
                                name="loop"
                                type="boolean"
                                default="true"
                                description="Wraps keyboard navigation from end to start and vice versa."
                            />
                            <Documentation.Props.Content
                                name="keepMounted"
                                type="boolean"
                                default="false"
                                description="Keeps inactive panels mounted and toggles hidden state instead of unmounting."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls sizing of list, tabs, and panel typography."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls rounded corners used by tabs and list in non-underline variants."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"pills" | "underline"'
                                default='"underline"'
                                description="Selects visual style for tab triggers."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root wrapper."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="TabsClassNames"
                                description="Slot-level class overrides for root, list, tab, and panel."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="tabs-subcomponent-props"
                        title="Subcomponent Props"
                        description="Props for Tabs.List, Tabs.Tab, and Tabs.Panel."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="Tabs.List"
                                type="TabsListProps"
                                description="Tablist wrapper that contains tab triggers."
                            />
                            <Documentation.Props.Content
                                name="Tabs.Tab"
                                type="TabsTabProps"
                                description="Interactive tab trigger. Requires value and supports disabled state."
                            />
                            <Documentation.Props.Content
                                name="Tabs.Panel"
                                type="TabsPanelProps"
                                description="Panel content linked to a matching tab value."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
