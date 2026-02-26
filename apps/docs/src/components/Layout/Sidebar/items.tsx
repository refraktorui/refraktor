import {
    IconRocket,
    IconLayoutList,
    IconLayoutGrid
} from "@tabler/icons-react";
import type { SidebarNode } from "@/typings";

const sidebarItems: SidebarNode[] = [
    {
        kind: "link",
        title: "Get Started",
        href: "/get-started",
        icon: <IconRocket size={16} />
    },
    {
        kind: "group",
        title: "Core",
        items: [
            {
                kind: "group",
                title: "Feedback",
                icon: <IconLayoutList size={16} />,
                items: [
                    {
                        kind: "link",
                        title: "Accordion",
                        href: "/core/accordion"
                    },
                    {
                        kind: "link",
                        title: "Button",
                        href: "/core/button"
                    },
                    {
                        kind: "link",
                        title: "Checkbox",
                        href: "/core/checkbox"
                    },
                    {
                        kind: "link",
                        title: "Switch",
                        href: "/core/switch"
                    },
                    {
                        kind: "link",
                        title: "Radio",
                        href: "/core/radio"
                    },
                    {
                        kind: "link",
                        title: "SegmentedControl",
                        href: "/core/segmented-control"
                    },
                    {
                        kind: "link",
                        title: "Drawer",
                        href: "/core/drawer"
                    },
                    {
                        kind: "link",
                        title: "Modal",
                        href: "/core/modal"
                    },
                    {
                        kind: "link",
                        title: "Input",
                        href: "/core/input"
                    },
                    {
                        kind: "link",
                        title: "Textarea",
                        href: "/core/textarea"
                    },
                    {
                        kind: "link",
                        title: "PasswordInput",
                        href: "/core/password-input"
                    },
                    {
                        kind: "link",
                        title: "NumberInput",
                        href: "/core/number-input"
                    },
                    {
                        kind: "link",
                        title: "Select",
                        href: "/core/select"
                    },
                    {
                        kind: "link",
                        title: "Slider",
                        href: "/core/slider"
                    },
                    {
                        kind: "link",
                        title: "Loader",
                        href: "/core/loader"
                    },
                    {
                        kind: "link",
                        title: "Progress",
                        href: "/core/progress"
                    },
                    {
                        kind: "link",
                        title: "ProgressCircle",
                        href: "/core/progress-circle"
                    },
                    {
                        kind: "link",
                        title: "FileInput",
                        href: "/core/file-input"
                    }
                ]
            },
            {
                kind: "group",
                title: "Data Display",
                icon: <IconLayoutGrid size={16} />,
                items: [
                    {
                        kind: "link",
                        title: "Avatar",
                        href: "/core/avatar"
                    },
                    {
                        kind: "link",
                        title: "Badge",
                        href: "/core/badge"
                    },
                    {
                        kind: "link",
                        title: "ColorSwatch",
                        href: "/core/color-swatch"
                    },
                    {
                        kind: "link",
                        title: "Table",
                        href: "/core/table"
                    },
                    {
                        kind: "link",
                        title: "Timeline",
                        href: "/core/timeline"
                    }
                ]
            },
            {
                kind: "group",
                title: "Navigation",
                items: [
                    {
                        kind: "link",
                        title: "Breadcrumbs",
                        href: "/core/breadcrumbs"
                    },
                    {
                        kind: "link",
                        title: "Menu",
                        href: "/core/menu"
                    },
                    {
                        kind: "link",
                        title: "Popover",
                        href: "/core/popover"
                    },
                    {
                        kind: "link",
                        title: "Tooltip",
                        href: "/core/tooltip"
                    },
                    {
                        kind: "link",
                        title: "Pagination",
                        href: "/core/pagination"
                    },
                    {
                        kind: "link",
                        title: "Tabs",
                        href: "/core/tabs"
                    }
                ]
            },
            {
                kind: "group",
                title: "Utilities",
                items: [
                    {
                        kind: "link",
                        title: "For",
                        href: "/core/for"
                    }
                ]
            }
        ]
    }
];

export default sidebarItems;
