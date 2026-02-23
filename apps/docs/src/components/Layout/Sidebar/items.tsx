import { IconLayoutGrid, IconRocket } from "@tabler/icons-react";
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
                title: "Layout",
                icon: <IconLayoutGrid size={16} />,
                items: [
                    {
                        kind: "link",
                        title: "Avatar",
                        href: "/core/avatar"
                    },
                    {
                        kind: "link",
                        title: "Something random",
                        href: "/core/layout/something-random"
                    },
                    {
                        kind: "link",
                        title: "Something else",
                        href: "/core/layout/something-else"
                    }
                ]
            }
        ]
    }
];

export default sidebarItems;
