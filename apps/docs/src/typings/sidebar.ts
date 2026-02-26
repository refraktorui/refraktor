import type { ReactNode } from "react";

export type SidebarLink = {
    kind: "link";
    href: string;
    title: string;
    icon?: ReactNode;
};

export type SidebarGroup = {
    kind: "group";
    title: string;
    icon?: ReactNode;
    items: SidebarNode[];
};

export type SidebarNode = SidebarLink | SidebarGroup;
