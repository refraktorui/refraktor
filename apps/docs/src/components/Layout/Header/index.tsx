import { Link, useRouterState } from "@tanstack/react-router";
import corePackage from "../../../../../../packages/core/package.json";
import { Badge, Button, cx, Tooltip } from "@refraktor/core";
import { IconBrandGithub, IconMenu2, IconX } from "@tabler/icons-react";

const coreVersion = corePackage.version;

interface HeaderProps {
    onMenuClick: () => void;
    mobileOpen: boolean;
}

export default function Header({ onMenuClick, mobileOpen }: HeaderProps) {
    const { location } = useRouterState();

    const isHome = location.pathname === "/";

    return (
        <header className="flex items-center justify-between sticky top-0 z-50 h-12 backdrop-blur-sm bg-dark-800 border-b border-dark-600 px-2 md:px-4">
            <div className="flex items-center gap-2 h-full">
                {!isHome && (
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={onMenuClick}
                        className="md:hidden text-dark-100"
                    >
                        <div className="relative size-5">
                            <IconMenu2
                                className={cx(
                                    "absolute inset-0 transition-all size-5",
                                    mobileOpen
                                        ? "opacity-0 rotate-90 scale-0"
                                        : "opacity-100 rotate-0 scale-100"
                                )}
                            />

                            <IconX
                                className={cx(
                                    "absolute inset-0 transition-all size-5",
                                    mobileOpen
                                        ? "opacity-100 rotate-0 scale-100"
                                        : "opacity-0 -rotate-90 scale-0"
                                )}
                            />
                        </div>
                    </Button>
                )}
                <Link
                    to="/"
                    className="group flex items-center gap-2 transition-all hover:opacity-80"
                >
                    <img src="/logo.svg" alt="Refraktor" className="size-8" />

                    <span className="text-base font-semibold hidden sm:block">
                        Refraktor
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-3 h-full">
                <Badge
                    size="sm"
                    className="border border-dark-500 bg-dark-600 text-dark-100"
                >
                    v{coreVersion}
                </Badge>

                <div className="w-px h-6 bg-dark-500" />

                <Tooltip content="View on GitHub">
                    <Link
                        to="https://github.com/refraktorui/refraktor"
                        target="_blank"
                    >
                        <Button
                            size="icon-md"
                            variant="ghost"
                            className="text-dark-100 hover:bg-dark-700"
                        >
                            <IconBrandGithub size={18} />
                        </Button>
                    </Link>
                </Tooltip>
            </div>
        </header>
    );
}
