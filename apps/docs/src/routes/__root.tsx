import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import CommandPalette from "@/components/Layout/CommandPalette";
import {
    createRootRoute,
    Outlet,
    useRouterState
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import NotFound from "@/components/NotFound";

function formatTitle(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function TitleManager() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        const segments = pathname.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        document.title = last
            ? `${formatTitle(last)} | Refraktor`
            : "Refraktor";
    }, [pathname]);

    return null;
}

function ScrollToTop() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function RootLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-dark-900 text-white">
            <TitleManager />
            <ScrollToTop />
            <CommandPalette
                opened={commandPaletteOpen}
                onOpenedChange={setCommandPaletteOpen}
            />
            <Header
                onMenuClick={() => setMobileOpen((prev) => !prev)}
                mobileOpen={mobileOpen}
                onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
            />

            <div className="flex flex-1">
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

                <div className="flex min-w-0 flex-1 flex-col">
                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
}

export const Route = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFound
});
