import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import NotFound from "@/components/NotFound";

export const Route = createRootRoute({
    component: () => {
        const [mobileOpen, setMobileOpen] = useState(false);

        return (
            <div className="flex flex-col min-h-screen bg-dark-900 text-white">
                <Header
                    onMenuClick={() => setMobileOpen((prev) => !prev)}
                    mobileOpen={mobileOpen}
                />

                <div className="flex flex-1">
                    <Sidebar
                        mobileOpen={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                    />

                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    },
    notFoundComponent: NotFound
});
