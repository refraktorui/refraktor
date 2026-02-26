import { Link, useRouterState } from "@tanstack/react-router";
import sidebarItems from "./items";
import { cx, For } from "@refraktor/core";
import type { SidebarNode } from "@/typings";
import type { CSSProperties } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

interface SidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

interface SidebarTreeNodeProps {
    node: SidebarNode;
    depth: number;
    pathname: string;
    onLinkClick?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const { location } = useRouterState();
    const isHome = location.pathname === "/";

    const mobileStateClasses = mobileOpen
        ? "translate-x-0 pointer-events-auto"
        : "-translate-x-full pointer-events-none";

    if (isHome) return null;

    return (
        <>
            <aside
                className={cx(
                    "w-72 flex-shrink-0 border-r border-dark-600 bg-dark-800 p-4 overflow-y-auto refraktor-scrollbar transition-transform duration-300 z-1",
                    "fixed top-12 bottom-0 left-0 z-40",
                    mobileStateClasses,
                    "md:sticky md:top-12 md:h-[calc(100vh-3rem)] md:translate-x-0 md:pointer-events-auto"
                )}
            >
                <div className="flex flex-col gap-2">
                    {sidebarItems.map((item) => (
                        <SidebarTreeNode
                            key={item.title}
                            node={item}
                            depth={0}
                            pathname={location.pathname}
                            onLinkClick={onClose}
                        />
                    ))}
                </div>
            </aside>

            <div
                className={cx(
                    mobileOpen &&
                        "absolute inset-0 bg-dark-900/50 backdrop-blur-sm z-0"
                )}
                onClick={onClose}
            />
        </>
    );
}

function SidebarTreeNode({
    node,
    depth,
    pathname,
    onLinkClick
}: SidebarTreeNodeProps) {
    if (node.kind === "link") {
        return (
            <SidebarLinkItem
                node={node}
                depth={depth}
                pathname={pathname}
                onClick={onLinkClick}
            />
        );
    }

    return (
        <SidebarGroupItem
            node={node}
            depth={depth}
            pathname={pathname}
            onLinkClick={onLinkClick}
        />
    );
}

interface SidebarLinkItemProps {
    node: Extract<SidebarNode, { kind: "link" }>;
    depth: number;
    pathname: string | null;
    onClick?: () => void;
}

function SidebarLinkItem({
    node,
    depth,
    pathname,
    onClick
}: SidebarLinkItemProps) {
    const isActive = isNodeActive(node, pathname);
    const offsetStyle: CSSProperties | undefined = depth
        ? { marginLeft: depth * 8 + 8 }
        : undefined;

    return (
        <div
            className={cx(
                depth > 0 && "border-l border-dark-600 pl-2",
                isActive && "border-primary-500",
                "relative"
            )}
            style={offsetStyle}
        >
            <Link
                to={node.href}
                className={cx(
                    "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-dark-100 transition-colors duration-150 hover:bg-dark-600/70 hover:text-white",
                    isActive && "bg-dark-600/70 text-white"
                )}
                onClick={() => {
                    onClick?.();
                }}
            >
                <span className="flex items-center gap-2">
                    {node.icon ? (
                        <span className="flex items-center" aria-hidden="true">
                            {node.icon}
                        </span>
                    ) : null}
                    <span className="text-sm font-medium">{node.title}</span>
                </span>
            </Link>
        </div>
    );
}

interface SidebarGroupItemProps {
    node: Extract<SidebarNode, { kind: "group" }>;
    depth: number;
    pathname: string | null;
    onLinkClick?: () => void;
}

function SidebarGroupItem({
    node,
    depth,
    pathname,
    onLinkClick
}: SidebarGroupItemProps) {
    const hasActiveChild = useMemo(
        () => groupHasActiveChild(node, pathname),
        [node, pathname]
    );
    const isDefaultGroup = node.title.toLowerCase() === "core";
    const [open, setOpen] = useState(
        () => hasActiveChild || (depth === 0 && isDefaultGroup)
    );

    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    const offsetStyle: CSSProperties | undefined = depth
        ? { marginLeft: depth * 8 + 8 }
        : undefined;

    return (
        <div
            className={cx(
                "flex flex-col gap-2",
                depth > 0 && "border-l border-dark-600 pl-2",
                hasActiveChild && "border-primary-500",
                "relative"
            )}
            style={offsetStyle}
        >
            <button
                type="button"
                className={cx(
                    "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm font-medium text-dark-100 transition-colors duration-150 hover:bg-dark-600/70 hover:text-white cursor-pointer",
                    open && "bg-dark-600/70 text-white"
                )}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
            >
                <span className="flex items-center gap-2">
                    {node.icon ? (
                        <span className="flex items-center" aria-hidden="true">
                            {node.icon}
                        </span>
                    ) : null}
                    <span>{node.title}</span>
                </span>
                <IconChevronRight
                    size={16}
                    className={cx(
                        "text-dark-100 transition-transform duration-150",
                        open && "rotate-90"
                    )}
                />
            </button>

            {open ? (
                <div className="flex flex-col gap-1">
                    <For each={node.items} keyExtractor={getNodeKey}>
                        {(child) => (
                            <SidebarTreeNode
                                node={child}
                                depth={depth + 1}
                                pathname={pathname ?? ("/" as string)}
                                onLinkClick={onLinkClick}
                            />
                        )}
                    </For>
                </div>
            ) : null}
        </div>
    );
}

function getNodeKey(node: SidebarNode, index: number) {
    if (node.kind === "link") {
        return node.href;
    }

    return `${node.title}-${index}`;
}

function isNodeActive(node: SidebarNode, pathname: string | null): boolean {
    if (!pathname) {
        return false;
    }

    if (node.kind === "link") {
        return matchPathname(pathname, node.href);
    }

    return node.items.some((child) => isNodeActive(child, pathname));
}

function groupHasActiveChild(
    node: Extract<SidebarNode, { kind: "group" }>,
    pathname: string | null
) {
    return node.items.some((child) => isNodeActive(child, pathname));
}

function matchPathname(pathname: string, target: string) {
    const normalizedPath = normalizePath(pathname);
    const normalizedTarget = normalizePath(target);

    if (normalizedTarget === "/") {
        return normalizedPath === "/";
    }

    return (
        normalizedPath === normalizedTarget ||
        normalizedPath.startsWith(`${normalizedTarget}/`)
    );
}

function normalizePath(path: string) {
    if (path.length > 1 && path.endsWith("/")) {
        return path.slice(0, -1);
    }

    return path;
}
