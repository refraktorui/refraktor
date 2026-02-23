import { IconHash } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface DocumentationSectionProps {
    id: string;
    title: string;
    description?: string;
    children?: ReactNode;
}

function DocumentationSection({
    id,
    title,
    description,
    children
}: DocumentationSectionProps) {
    return (
        <section id={id} className="flex flex-col gap-4 scroll-mt-20">
            <div className="flex flex-col gap-2">
                <Link to={`#${id}`} className="group relative block w-fit">
                    <IconHash className="pointer-events-none absolute -left-7 top-1/2 size-4.5 -translate-y-1/2 text-dark-100 opacity-0 transition-opacity group-hover:opacity-100" />
                    <h2 className="text-xl font-semibold text-white">
                        {title}
                    </h2>
                </Link>

                {description && (
                    <p className="text-dark-200 text-sm leading-relaxed max-w-5xl">
                        {description}
                    </p>
                )}
            </div>
            {children && <div className="flex flex-col gap-4">{children}</div>}
        </section>
    );
}

export default DocumentationSection;
