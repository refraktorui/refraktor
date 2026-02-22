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
                <Link to={`#${id}`}>
                    <div className="flex group items-center gap-2">
                        <IconHash className="size-4 transition-all text-dark-100 group-hover:text-white" />
                        <h2 className="text-xl font-semibold text-white">
                            {title}
                        </h2>
                    </div>
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
