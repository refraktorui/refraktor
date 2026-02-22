import { Button } from "@refraktor/core";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center h-full">
            <h1 className="text-7xl font-bold">404</h1>
            <p className="text-xl text-dark-100">Page not found</p>

            <Link to="/" className="text-sm text-dark-100">
                <Button size="lg">Back to Home</Button>
            </Link>
        </div>
    );
}
