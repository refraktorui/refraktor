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
                        title: "Drawer",
                        href: "/core/drawer"
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
                    }
                ]
            }
        ]
    }
];

export default sidebarItems;
