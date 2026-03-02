import Documentation from "@/components/Documentation";
import { Button, Menu } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/menu/")({
    component: RouteComponent
});

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Menu"
                description="Display contextual action lists with keyboard navigation, section labels, and nested submenus."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/menu/menu.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <Documentation.Showcase
                            code={`import { Button, Menu } from "@refraktor/core";

export function Demo() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button variant="outline">Actions</Button>
      </Menu.Trigger>

      <Menu.Dropdown>
        <Menu.Item>Open</Menu.Item>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}`}
                        >
                            <Menu>
                                <Menu.Trigger>
                                    <Button variant="outline">Actions</Button>
                                </Menu.Trigger>

                                <Menu.Dropdown>
                                    <Menu.Item>Open</Menu.Item>
                                    <Menu.Item>Rename</Menu.Item>
                                    <Menu.Item>Duplicate</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="labels-and-separators"
                        title="Labels and separators"
                        description="Group related actions with Menu.Label and Menu.Separator, and show shortcuts with rightSection."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Menu } from "@refraktor/core";

export function Demo() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button variant="outline">File</Button>
      </Menu.Trigger>

      <Menu.Dropdown>
        <Menu.Label>Document</Menu.Label>
        <Menu.Item rightSection="Ctrl+N">New file</Menu.Item>
        <Menu.Item rightSection="Ctrl+S">Save</Menu.Item>
        <Menu.Separator />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item closeOnSelect={false}>Delete...</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}`}
                        >
                            <Menu>
                                <Menu.Trigger>
                                    <Button variant="outline">File</Button>
                                </Menu.Trigger>

                                <Menu.Dropdown>
                                    <Menu.Label>Document</Menu.Label>
                                    <Menu.Item rightSection="Ctrl+N">
                                        New file
                                    </Menu.Item>
                                    <Menu.Item rightSection="Ctrl+S">
                                        Save
                                    </Menu.Item>
                                    <Menu.Separator />
                                    <Menu.Label>Danger zone</Menu.Label>
                                    <Menu.Item closeOnSelect={false}>
                                        Delete...
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="submenus"
                        title="Submenus"
                        description="Nest additional action groups with Menu.Sub, Menu.SubTrigger, and Menu.SubDropdown."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Menu } from "@refraktor/core";

export function Demo() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button variant="outline">Share</Button>
      </Menu.Trigger>

      <Menu.Dropdown>
        <Menu.Item>Copy link</Menu.Item>

        <Menu.Sub>
          <Menu.SubTrigger>Email</Menu.SubTrigger>

          <Menu.SubDropdown>
            <Menu.Item>Invite viewer</Menu.Item>
            <Menu.Item>Invite editor</Menu.Item>
          </Menu.SubDropdown>
        </Menu.Sub>
      </Menu.Dropdown>
    </Menu>
  );
}`}
                        >
                            <Menu>
                                <Menu.Trigger>
                                    <Button variant="outline">Share</Button>
                                </Menu.Trigger>

                                <Menu.Dropdown>
                                    <Menu.Item>Copy link</Menu.Item>

                                    <Menu.Sub>
                                        <Menu.SubTrigger>Email</Menu.SubTrigger>

                                        <Menu.SubDropdown>
                                            <Menu.Item>Invite viewer</Menu.Item>
                                            <Menu.Item>Invite editor</Menu.Item>
                                        </Menu.SubDropdown>
                                    </Menu.Sub>
                                </Menu.Dropdown>
                            </Menu>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="trigger-behavior"
                        title="Trigger behavior"
                        description="Use trigger and delay props to switch between click, hover, or focus activation patterns."
                    >
                        <Documentation.Showcase
                            code={`import { Button, Menu } from "@refraktor/core";

export function Demo() {
  return (
    <Menu trigger="hover" openDelay={100} closeDelay={150}>
      <Menu.Trigger>
        <Button variant="outline">Hover me</Button>
      </Menu.Trigger>

      <Menu.Dropdown>
        <Menu.Item>Preview</Menu.Item>
        <Menu.Item>Inspect</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}`}
                        >
                            <Menu trigger="hover" openDelay={100} closeDelay={150}>
                                <Menu.Trigger>
                                    <Button variant="outline">Hover me</Button>
                                </Menu.Trigger>

                                <Menu.Dropdown>
                                    <Menu.Item>Preview</Menu.Item>
                                    <Menu.Item>Inspect</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="menu-props"
                        title="Menu Props"
                        description="The props for the Menu root component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Menu compound structure including trigger and dropdown."
                                required
                            />
                            <Documentation.Props.Content
                                name="opened"
                                type="boolean"
                                description="Controlled open state."
                            />
                            <Documentation.Props.Content
                                name="defaultOpened"
                                type="boolean"
                                default="false"
                                description="Initial open state for uncontrolled usage."
                            />
                            <Documentation.Props.Content
                                name="onOpenedChange"
                                type="(opened: boolean) => void"
                                description="Called when menu open state changes."
                            />
                            <Documentation.Props.Content
                                name="trigger"
                                type='"click" | "hover" | "focus"'
                                default='"click"'
                                description="How the menu is opened."
                            />
                            <Documentation.Props.Content
                                name="positioning"
                                type="MenuPositioning"
                                default='{ placement: "bottom-start", offset: 4 }'
                                description="Floating placement and offset configuration."
                            />
                            <Documentation.Props.Content
                                name="strategy"
                                type='"absolute" | "fixed"'
                                default='"fixed"'
                                description="Floating UI positioning strategy for menu dropdowns."
                            />
                            <Documentation.Props.Content
                                name="middlewares"
                                type="MenuMiddlewares"
                                default='{ flip: true, shift: true }'
                                description="Floating UI middleware configuration."
                            />
                            <Documentation.Props.Content
                                name="openDelay"
                                type="number"
                                default="0"
                                description="Delay before opening in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="closeDelay"
                                type="number"
                                default="100"
                                description="Delay before closing in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="transitionProps"
                                type='Omit<TransitionProps, "children" | "mounted">'
                                description="Transition options for dropdown enter/exit animations."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Border radius used by dropdown surfaces."
                            />
                            <Documentation.Props.Content
                                name="withinPortal"
                                type="boolean"
                                default="true"
                                description="Renders dropdowns inside a portal when true."
                            />
                            <Documentation.Props.Content
                                name="closeOnClickOutside"
                                type="boolean"
                                default="true"
                                description="Closes menu when clicking outside."
                            />
                            <Documentation.Props.Content
                                name="closeOnEscape"
                                type="boolean"
                                default="true"
                                description="Closes menu when pressing Escape."
                            />
                            <Documentation.Props.Content
                                name="closeOnItemClick"
                                type="boolean"
                                default="true"
                                description="Closes the whole menu tree after selecting an item."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="MenuClassNames"
                                description="Slot-level class overrides for root, trigger, dropdown, item, label, separator, and submenu parts."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="menu-item-props"
                        title="Menu.Item Props"
                        description="The props for selectable menu items."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Visible item content."
                                required
                            />
                            <Documentation.Props.Content
                                name="onSelect"
                                type="() => void"
                                description="Called when the item is selected."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables selection and pointer interaction."
                            />
                            <Documentation.Props.Content
                                name="closeOnSelect"
                                type="boolean"
                                description="Overrides Menu closeOnItemClick for this item."
                            />
                            <Documentation.Props.Content
                                name="textValue"
                                type="string"
                                description="Typeahead value when children content is not plain text."
                            />
                            <Documentation.Props.Content
                                name="leftSection"
                                type="ReactNode"
                                description="Content rendered before the item label."
                            />
                            <Documentation.Props.Content
                                name="rightSection"
                                type="ReactNode"
                                description="Content rendered after the item label."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the item element."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="menu-sub-props"
                        title="Menu.Sub Props"
                        description="The props for submenu containers."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Sub trigger and sub dropdown content."
                                required
                            />
                            <Documentation.Props.Content
                                name="trigger"
                                type='"click" | "hover" | "focus"'
                                default='"hover"'
                                description="How the submenu is opened."
                            />
                            <Documentation.Props.Content
                                name="strategy"
                                type='"absolute" | "fixed"'
                                default='"fixed"'
                                description="Floating UI positioning strategy for the submenu dropdown."
                            />
                            <Documentation.Props.Content
                                name="openDelay"
                                type="number"
                                default="75"
                                description="Delay before opening submenu in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="closeDelay"
                                type="number"
                                default="125"
                                description="Delay before closing submenu in milliseconds."
                            />
                            <Documentation.Props.Content
                                name="closeOnClickOutside"
                                type="boolean"
                                default="false"
                                description="Closes submenu on outside click."
                            />
                            <Documentation.Props.Content
                                name="closeOnEscape"
                                type="boolean"
                                default="true"
                                description="Closes submenu when pressing Escape."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables submenu interactions."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
