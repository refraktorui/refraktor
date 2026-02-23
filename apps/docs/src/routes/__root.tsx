import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import NotFound from "@/components/NotFound";

function TitleManager() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        const segments = pathname.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        document.title = last
            ? `${last.charAt(0).toUpperCase() + last.slice(1)} | Refraktor`
            : "Refraktor";
    }, [pathname]);

    return null;
}

export const Route = createRootRoute({
    component: () => {
        const [mobileOpen, setMobileOpen] = useState(false);

        return (
            <div className="flex flex-col min-h-screen bg-dark-900 text-white">
                <TitleManager />
                <Header
                    onMenuClick={() => setMobileOpen((prev) => !prev)}
                    mobileOpen={mobileOpen}
                />

                <div className="flex flex-1">
                    <Sidebar
                        mobileOpen={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                        <main className="flex-1 p-4">
                            <Outlet />
                        </main>

                        <Footer />
                    </div>
                </div>
            </div>
        );
    },
    notFoundComponent: NotFound
});
