import { Link } from "@tanstack/react-router";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-dark-600 bg-dark-800 px-4 py-2">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 text-xs text-dark-200">
                <p>© {year} Refraktor</p>

                <div className="flex items-center gap-3">
                    <Link
                        to="/docs/get-started"
                        className="transition-colors hover:text-dark-100"
                    >
                        Get Started
                    </Link>

                    <a
                        href="https://github.com/refraktorui/refraktor"
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-dark-100"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
