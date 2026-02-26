import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Button,
    Drawer,
    type DrawerPosition,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

export const Route = createFileRoute("/core/drawer/")({
    component: RouteComponent
});

interface EmbeddedDrawerDemoProps {
    triggerLabel: string;
    children: (state: {
        opened: boolean;
        setOpened: (opened: boolean) => void;
    }) => ReactNode;
}

function EmbeddedDrawerDemo({
    triggerLabel,
    children
}: EmbeddedDrawerDemoProps) {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Button onClick={() => setOpened(true)}>{triggerLabel}</Button>
            {children({ opened, setOpened })}
        </>
    );
}

function formatBooleanProp(
    name: string,
    value: boolean,
    defaultValue: boolean
): string | null {
    if (value === defaultValue) {
        return null;
    }

    return value ? name : `${name}={false}`;
}

const DrawerPlayground = createPlayground(
    {
        position: {
            type: "segmented",
            label: "Position",
            options: ["right", "left", "top", "bottom"] as const,
            default: "right"
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
            default: "none"
        },
        withOverlay: {
            type: "switch",
            label: "Overlay",
            default: true
        },
        withCloseButton: {
            type: "switch",
            label: "Close Button",
            default: true
        },
        closeOnClickOutside: {
            type: "switch",
            label: "Outside Click",
            default: true
        },
        closeOnEscape: {
            type: "switch",
            label: "Escape Key",
            default: true
        }
    },
    {
        code: (props, defaults) => {
            const rootProps = [
                "defaultOpened",
                props.position !== defaults.position
                    ? `position="${props.position}"`
                    : null,
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                formatBooleanProp(
                    "closeOnClickOutside",
                    props.closeOnClickOutside,
                    defaults.closeOnClickOutside as boolean
                ),
                formatBooleanProp(
                    "closeOnEscape",
                    props.closeOnEscape,
                    defaults.closeOnEscape as boolean
                )
            ].filter((value): value is string => value !== null);

            const openingTag =
                rootProps.length > 0
                    ? `<Drawer.Root\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n>`
                    : "<Drawer.Root>";

            const overlayBlock = props.withOverlay
                ? "  <Drawer.Overlay />\n\n"
                : "";
            const headerProps = props.withCloseButton
                ? ' text="Edit profile"'
                : ' text="Edit profile" withClose={false}';

            return createSnippet({
                imports: [`import { Drawer } from "@refraktor/core";`],
                jsx: `${openingTag}
${overlayBlock}  <Drawer.Content>
    <Drawer.Header${headerProps} />
    <Drawer.Body>
      Update account details and preferences inside this panel.
    </Drawer.Body>
  </Drawer.Content>
</Drawer.Root>`
            });
        }
    }
);

interface DrawerPlaygroundPreviewProps {
    position: DrawerPosition;
    size: RefraktorSize;
    radius: RefraktorRadius;
    withOverlay: boolean;
    withCloseButton: boolean;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
}

function DrawerPlaygroundPreview({
    position,
    size,
    radius,
    withOverlay,
    withCloseButton,
    closeOnClickOutside,
    closeOnEscape
}: DrawerPlaygroundPreviewProps) {
    return (
        <EmbeddedDrawerDemo triggerLabel="Open drawer">
            {({ opened, setOpened }) => (
                <Drawer.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    position={position}
                    size={size}
                    radius={radius}
                    closeOnClickOutside={closeOnClickOutside}
                    closeOnEscape={closeOnEscape}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    {withOverlay && <Drawer.Overlay />}

                    <Drawer.Content>
                        <Drawer.Header
                            text="Edit profile"
                            withClose={withCloseButton}
                        />

                        <Drawer.Body className="space-y-3 text-sm text-dark-200">
                            <p>
                                Keep frequently edited profile information in a
                                focused side panel.
                            </p>

                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="filled">
                                    Save changes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setOpened(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            )}
        </EmbeddedDrawerDemo>
    );
}

function ShorthandDrawerShowcase() {
    return (
        <EmbeddedDrawerDemo triggerLabel="Open shorthand drawer">
            {({ opened, setOpened }) => (
                <Drawer
                    opened={opened}
                    onOpenedChange={setOpened}
                    title="Invite teammates"
                    overlayProps={{ backgroundOpacity: 0.35, blur: 4 }}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    <p className="text-sm text-dark-200">
                        Add collaborators with view or edit access in a compact
                        flow.
                    </p>
                </Drawer>
            )}
        </EmbeddedDrawerDemo>
    );
}

function PositionAndSizeShowcase() {
    return (
        <EmbeddedDrawerDemo triggerLabel="Open left drawer">
            {({ opened, setOpened }) => (
                <Drawer.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    position="left"
                    size="sm"
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    <Drawer.Overlay />

                    <Drawer.Content>
                        <Drawer.Header text="Navigation" />

                        <Drawer.Body className="space-y-2 text-sm text-dark-200">
                            <p>Use left drawers for contextual navigation.</p>
                            <p>
                                Size controls width on left and right positions.
                            </p>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            )}
        </EmbeddedDrawerDemo>
    );
}

function OverlayShowcase() {
    return (
        <EmbeddedDrawerDemo triggerLabel="Open custom overlay">
            {({ opened, setOpened }) => (
                <Drawer.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    <Drawer.Overlay backgroundOpacity={0.2} blur={8} />

                    <Drawer.Content>
                        <Drawer.Header text="Filter events" />

                        <Drawer.Body className="space-y-2 text-sm text-dark-200">
                            <p>
                                Increase blur to separate the active panel from
                                the page.
                            </p>
                            <p>
                                Lower opacity keeps more context visible behind
                                the drawer.
                            </p>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            )}
        </EmbeddedDrawerDemo>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Drawer"
                description="Display off-canvas panels with focus management, keyboard dismiss behavior, and compound subcomponents for full layout control."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/drawer/drawer.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <DrawerPlayground.Wrapper>
                            <DrawerPlayground.Preview>
                                {({
                                    position,
                                    size,
                                    radius,
                                    withOverlay,
                                    withCloseButton,
                                    closeOnClickOutside,
                                    closeOnEscape
                                }) => (
                                    <DrawerPlaygroundPreview
                                        key={`${position}-${size}-${radius}-${withOverlay}-${withCloseButton}-${closeOnClickOutside}-${closeOnEscape}`}
                                        position={position as DrawerPosition}
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        withOverlay={withOverlay}
                                        withCloseButton={withCloseButton}
                                        closeOnClickOutside={
                                            closeOnClickOutside
                                        }
                                        closeOnEscape={closeOnEscape}
                                    />
                                )}
                            </DrawerPlayground.Preview>

                            <DrawerPlayground.Controls />

                            <DrawerPlayground.Code />
                        </DrawerPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="shorthand-api"
                        title="Shorthand API"
                        description="Use Drawer when you want title, overlay, and body wiring handled automatically."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Drawer } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Invite teammates</Button>

      <Drawer
        opened={opened}
        onOpenedChange={setOpened}
        title="Invite teammates"
      >
        Add collaborators with view or edit access.
      </Drawer>
    </>
  );
}`}
                        >
                            <ShorthandDrawerShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="position-size"
                        title="Position and size"
                        description="Set position and size to control where the drawer appears and how much space it occupies."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Drawer } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Open navigation</Button>

      <Drawer.Root
        opened={opened}
        onOpenedChange={setOpened}
        position="left"
        size="sm"
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header text="Navigation" />
          <Drawer.Body>Section links and shortcuts</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}`}
                        >
                            <PositionAndSizeShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="overlay-customization"
                        title="Overlay customization"
                        description="Tune backgroundOpacity and blur on Drawer.Overlay to match the depth and focus of your layout."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Drawer } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Open filters</Button>

      <Drawer.Root opened={opened} onOpenedChange={setOpened}>
        <Drawer.Overlay backgroundOpacity={0.2} blur={8} />
        <Drawer.Content>
          <Drawer.Header text="Filter events" />
          <Drawer.Body>Use custom overlay styling for depth.</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}`}
                        >
                            <OverlayShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="drawer-root-props"
                        title="Drawer.Root Props"
                        description="The props for the Drawer.Root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Drawer subcomponents such as Drawer.Overlay, Drawer.Content, Drawer.Header, and Drawer.Body."
                            />
                            <Documentation.Props.Content
                                name="opened"
                                type="boolean"
                                description="Controlled open state for the drawer."
                            />
                            <Documentation.Props.Content
                                name="defaultOpened"
                                type="boolean"
                                description="Initial open state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onOpenedChange"
                                type="(opened: boolean) => void"
                                description="Called whenever the drawer open state changes."
                            />
                            <Documentation.Props.Content
                                name="closeOnClickOutside"
                                type="boolean"
                                default="true"
                                description="Closes the drawer when clicking outside content."
                            />
                            <Documentation.Props.Content
                                name="closeOnEscape"
                                type="boolean"
                                default="true"
                                description="Closes the drawer when Escape is pressed."
                            />
                            <Documentation.Props.Content
                                name="lockScroll"
                                type="boolean"
                                default="true"
                                description="Locks body scrolling while the drawer is opened."
                            />
                            <Documentation.Props.Content
                                name="withinPortal"
                                type="boolean"
                                default="true"
                                description="Renders overlay and content inside a portal."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"none"'
                                description="Controls border radius for Drawer.Content."
                            />
                            <Documentation.Props.Content
                                name="position"
                                type='"left" | "right" | "top" | "bottom"'
                                default='"right"'
                                description="Side where the drawer enters the viewport."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Width for left/right drawers or height for top/bottom drawers."
                            />
                            <Documentation.Props.Content
                                name="trapFocus"
                                type="boolean"
                                default="true"
                                description="Traps keyboard focus inside the drawer while open."
                            />
                            <Documentation.Props.Content
                                name="returnFocus"
                                type="boolean"
                                default="true"
                                description="Returns focus to the previously focused element after close."
                            />
                            <Documentation.Props.Content
                                name="transitionProps"
                                type='Omit<TransitionProps, "children" | "mounted">'
                                description="Transition configuration forwarded to overlay and content animations."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="DrawerClassNames"
                                description="Slot-level class overrides for root, overlay, content, header, body, and close."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-props"
                        title="Drawer Props"
                        description="Additional shorthand props on Drawer. Drawer also supports all Drawer.Root props."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Body content rendered inside Drawer.Body."
                            />
                            <Documentation.Props.Content
                                name="title"
                                type="ReactNode"
                                description="Header title content rendered inside Drawer.Header."
                            />
                            <Documentation.Props.Content
                                name="withOverlay"
                                type="boolean"
                                default="true"
                                description="Controls whether Drawer.Overlay is rendered."
                            />
                            <Documentation.Props.Content
                                name="withCloseButton"
                                type="boolean"
                                default="true"
                                description="Controls whether Drawer.Header renders Drawer.Close."
                            />
                            <Documentation.Props.Content
                                name="overlayProps"
                                type="DrawerOverlayProps"
                                description="Props forwarded to Drawer.Overlay in shorthand mode."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-overlay-props"
                        title="Drawer.Overlay Props"
                        description="The props for Drawer.Overlay."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="closeOnClick"
                                type="boolean"
                                default="true"
                                description="Controls whether clicking the overlay closes the drawer."
                            />
                            <Documentation.Props.Content
                                name="backgroundOpacity"
                                type="number"
                                default="0.5"
                                description="Alpha value used for overlay background color."
                            />
                            <Documentation.Props.Content
                                name="blur"
                                type="number | string"
                                default="0"
                                description="Backdrop blur strength in pixels or any CSS length."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the overlay element."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-content-props"
                        title="Drawer.Content Props"
                        description="The props for Drawer.Content."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Drawer content, usually Drawer.Header and Drawer.Body."
                                required
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the content container."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-header-props"
                        title="Drawer.Header Props"
                        description="The props for Drawer.Header."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Header content when text prop is not provided."
                            />
                            <Documentation.Props.Content
                                name="text"
                                type="ReactNode"
                                description="Shorthand header text rendered as the title."
                            />
                            <Documentation.Props.Content
                                name="withClose"
                                type="boolean"
                                default="true"
                                description="Controls whether Drawer.Close is rendered in the header."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the header wrapper."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-body-props"
                        title="Drawer.Body Props"
                        description="The props for Drawer.Body."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Scrollable drawer body content."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the body container."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="drawer-close-props"
                        title="Drawer.Close Props"
                        description="The props for Drawer.Close."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Custom close icon or label rendered inside the button."
                            />
                            <Documentation.Props.Content
                                name="onClick"
                                type="(event: MouseEvent<HTMLButtonElement>) => void"
                                description="Called before drawer close logic runs."
                            />
                            <Documentation.Props.Content
                                name="type"
                                type='"button" | "submit" | "reset"'
                                default='"button"'
                                description="Native button type attribute for the close control."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the close button."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
