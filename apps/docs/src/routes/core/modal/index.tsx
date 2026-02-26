import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    Button,
    Modal,
    type ModalSize,
    type RefraktorRadius
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

export const Route = createFileRoute("/core/modal/")({
    component: RouteComponent
});

interface EmbeddedModalDemoProps {
    triggerLabel: string;
    children: (state: {
        opened: boolean;
        setOpened: (opened: boolean) => void;
    }) => ReactNode;
}

function EmbeddedModalDemo({ triggerLabel, children }: EmbeddedModalDemoProps) {
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

const ModalPlayground = createPlayground(
    {
        size: {
            type: "select",
            label: "Size",
            options: ["xs", "sm", "md", "lg", "xl", "full"] as const,
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
        centered: {
            type: "switch",
            label: "Centered",
            default: true
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
                props.size !== defaults.size ? `size="${props.size}"` : null,
                props.radius !== defaults.radius
                    ? `radius="${props.radius}"`
                    : null,
                formatBooleanProp(
                    "centered",
                    props.centered,
                    defaults.centered as boolean
                ),
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
                    ? `<Modal.Root\n${rootProps.map((prop) => `  ${prop}`).join("\n")}\n>`
                    : "<Modal.Root>";

            const overlayBlock = props.withOverlay ? "  <Modal.Overlay />\n\n" : "";
            const headerTag = props.withCloseButton
                ? "<Modal.Header>Edit profile</Modal.Header>"
                : "<Modal.Header withClose={false}>Edit profile</Modal.Header>";

            return createSnippet({
                imports: [`import { Modal } from "@refraktor/core";`],
                jsx: `${openingTag}
${overlayBlock}  <Modal.Content>
    ${headerTag}
    <Modal.Body>
      Update account details and preferences in this dialog.
    </Modal.Body>
  </Modal.Content>
</Modal.Root>`
            });
        }
    }
);

interface ModalPlaygroundPreviewProps {
    size: ModalSize;
    radius: RefraktorRadius;
    centered: boolean;
    withOverlay: boolean;
    withCloseButton: boolean;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
}

function ModalPlaygroundPreview({
    size,
    radius,
    centered,
    withOverlay,
    withCloseButton,
    closeOnClickOutside,
    closeOnEscape
}: ModalPlaygroundPreviewProps) {
    return (
        <EmbeddedModalDemo triggerLabel="Open modal">
            {({ opened, setOpened }) => (
                <Modal.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    size={size}
                    radius={radius}
                    centered={centered}
                    closeOnClickOutside={closeOnClickOutside}
                    closeOnEscape={closeOnEscape}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    {withOverlay && <Modal.Overlay />}

                    <Modal.Content>
                        <Modal.Header withClose={withCloseButton}>
                            Edit profile
                        </Modal.Header>

                        <Modal.Body className="space-y-3 text-sm text-dark-200">
                            <p>
                                Keep confirmation flows and focused forms in a
                                centered dialog.
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
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            )}
        </EmbeddedModalDemo>
    );
}

function ShorthandModalShowcase() {
    return (
        <EmbeddedModalDemo triggerLabel="Open shorthand modal">
            {({ opened, setOpened }) => (
                <Modal
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
                        confirmation flow.
                    </p>
                </Modal>
            )}
        </EmbeddedModalDemo>
    );
}

function SizeAndAlignmentShowcase() {
    return (
        <EmbeddedModalDemo triggerLabel="Open top-aligned modal">
            {({ opened, setOpened }) => (
                <Modal.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    size="lg"
                    centered={false}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    <Modal.Overlay />

                    <Modal.Content>
                        <Modal.Header>Publish changes</Modal.Header>

                        <Modal.Body className="space-y-2 text-sm text-dark-200">
                            <p>Use size to control content width.</p>
                            <p>
                                Set centered to false when dialogs should align
                                near the top of the viewport.
                            </p>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            )}
        </EmbeddedModalDemo>
    );
}

function OverlayShowcase() {
    return (
        <EmbeddedModalDemo triggerLabel="Open custom overlay">
            {({ opened, setOpened }) => (
                <Modal.Root
                    opened={opened}
                    onOpenedChange={setOpened}
                    withinPortal={false}
                    className="relative h-full"
                    transitionProps={{ duration: 150 }}
                >
                    <Modal.Overlay backgroundOpacity={0.2} blur={8} />

                    <Modal.Content>
                        <Modal.Header>Filter events</Modal.Header>

                        <Modal.Body className="space-y-2 text-sm text-dark-200">
                            <p>
                                Increase blur to separate active dialog content
                                from the page.
                            </p>
                            <p>
                                Lower opacity keeps surrounding context more
                                visible.
                            </p>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            )}
        </EmbeddedModalDemo>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Modal"
                description="Display centered dialogs with focus management, keyboard dismiss behavior, and compound subcomponents for full layout control."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/modal/modal.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <ModalPlayground.Wrapper>
                            <ModalPlayground.Preview>
                                {({
                                    size,
                                    radius,
                                    centered,
                                    withOverlay,
                                    withCloseButton,
                                    closeOnClickOutside,
                                    closeOnEscape
                                }) => (
                                    <ModalPlaygroundPreview
                                        key={`${size}-${radius}-${centered}-${withOverlay}-${withCloseButton}-${closeOnClickOutside}-${closeOnEscape}`}
                                        size={size as ModalSize}
                                        radius={radius as RefraktorRadius}
                                        centered={centered}
                                        withOverlay={withOverlay}
                                        withCloseButton={withCloseButton}
                                        closeOnClickOutside={
                                            closeOnClickOutside
                                        }
                                        closeOnEscape={closeOnEscape}
                                    />
                                )}
                            </ModalPlayground.Preview>

                            <ModalPlayground.Controls />

                            <ModalPlayground.Code />
                        </ModalPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="shorthand-api"
                        title="Shorthand API"
                        description="Use Modal when you want title, overlay, and body wiring handled automatically."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Modal } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Invite teammates</Button>

      <Modal
        opened={opened}
        onOpenedChange={setOpened}
        title="Invite teammates"
      >
        Add collaborators with view or edit access.
      </Modal>
    </>
  );
}`}
                        >
                            <ShorthandModalShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="size-alignment"
                        title="Size and alignment"
                        description="Set size and centered to control dialog width and vertical placement."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Modal } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Open publish dialog</Button>

      <Modal.Root
        opened={opened}
        onOpenedChange={setOpened}
        size="lg"
        centered={false}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>Publish changes</Modal.Header>
          <Modal.Body>Review summary and confirm publishing.</Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}`}
                        >
                            <SizeAndAlignmentShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="overlay-customization"
                        title="Overlay customization"
                        description="Tune backgroundOpacity and blur on Modal.Overlay to match depth and focus of your layout."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Modal } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Open filters</Button>

      <Modal.Root opened={opened} onOpenedChange={setOpened}>
        <Modal.Overlay backgroundOpacity={0.2} blur={8} />
        <Modal.Content>
          <Modal.Header>Filter events</Modal.Header>
          <Modal.Body>Use custom overlay styling for depth.</Modal.Body>
        </Modal.Content>
      </Modal.Root>
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
                        id="modal-root-props"
                        title="Modal.Root Props"
                        description="The props for the Modal.Root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Modal subcomponents such as Modal.Overlay, Modal.Content, Modal.Header, and Modal.Body."
                            />
                            <Documentation.Props.Content
                                name="opened"
                                type="boolean"
                                description="Controlled open state for the modal."
                            />
                            <Documentation.Props.Content
                                name="defaultOpened"
                                type="boolean"
                                description="Initial open state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onOpenedChange"
                                type="(opened: boolean) => void"
                                description="Called whenever the modal open state changes."
                            />
                            <Documentation.Props.Content
                                name="closeOnClickOutside"
                                type="boolean"
                                default="true"
                                description="Closes the modal when clicking outside content."
                            />
                            <Documentation.Props.Content
                                name="closeOnEscape"
                                type="boolean"
                                default="true"
                                description="Closes the modal when Escape is pressed."
                            />
                            <Documentation.Props.Content
                                name="lockScroll"
                                type="boolean"
                                default="true"
                                description="Locks body scrolling while the modal is opened."
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
                                default='"md"'
                                description="Controls border radius for Modal.Content."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl" | "full"'
                                default='"md"'
                                description="Controls max-width of Modal.Content."
                            />
                            <Documentation.Props.Content
                                name="centered"
                                type="boolean"
                                default="true"
                                description="Centers modal vertically when true."
                            />
                            <Documentation.Props.Content
                                name="trapFocus"
                                type="boolean"
                                default="true"
                                description="Traps keyboard focus inside the modal while open."
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
                                type="ModalClassNames"
                                description="Slot-level class overrides for root, overlay, content, header, body, and close."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="modal-props"
                        title="Modal Props"
                        description="Additional shorthand props on Modal. Modal also supports all Modal.Root props."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Body content rendered inside Modal.Body."
                            />
                            <Documentation.Props.Content
                                name="title"
                                type="ReactNode"
                                description="Header title content rendered inside Modal.Header."
                            />
                            <Documentation.Props.Content
                                name="withOverlay"
                                type="boolean"
                                default="true"
                                description="Controls whether Modal.Overlay is rendered."
                            />
                            <Documentation.Props.Content
                                name="withCloseButton"
                                type="boolean"
                                default="true"
                                description="Controls whether Modal.Header renders Modal.Close."
                            />
                            <Documentation.Props.Content
                                name="overlayProps"
                                type="ModalOverlayProps"
                                description="Props forwarded to Modal.Overlay in shorthand mode."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="modal-overlay-props"
                        title="Modal.Overlay Props"
                        description="The props for Modal.Overlay."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="closeOnClick"
                                type="boolean"
                                default="true"
                                description="Controls whether clicking the overlay closes the modal."
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
                        id="modal-content-props"
                        title="Modal.Content Props"
                        description="The props for Modal.Content."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Modal content, usually Modal.Header and Modal.Body."
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
                        id="modal-header-props"
                        title="Modal.Header Props"
                        description="The props for Modal.Header."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Header content rendered as the dialog title."
                            />
                            <Documentation.Props.Content
                                name="withClose"
                                type="boolean"
                                default="true"
                                description="Controls whether Modal.Close is rendered in the header."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the header wrapper."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="modal-body-props"
                        title="Modal.Body Props"
                        description="The props for Modal.Body."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Scrollable modal body content."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the body container."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="modal-close-props"
                        title="Modal.Close Props"
                        description="The props for Modal.Close."
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
                                description="Called before modal close logic runs."
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
