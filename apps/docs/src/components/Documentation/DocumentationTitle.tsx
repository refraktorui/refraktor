import { Link } from "@tanstack/react-router";
import packages from "./packages";
import { Button } from "@refraktor/core";
import {
    IconBrandGithub,
    IconBrandNpm,
    IconExternalLink
} from "@tabler/icons-react";

interface DocumentationTitleProps {
    name: string;
    description?: string;
    packageName?: keyof typeof packages;
    source?: string;
}

function DocumentationTitle({
    name,
    description,
    packageName = "core",
    source
}: DocumentationTitleProps) {
    const packageInfo = packages[packageName];

    return (
        <div className="flex flex-col gap-3 pb-8 border-b border-dark-600">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {name}
            </h1>

            {description && (
                <p className="text-dark-200 text-base leading-relaxed max-w-2xl">
                    {description}
                </p>
            )}

            {(packageName || source) && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {packageName && (
                        <Link to={packageInfo.npm} target="_blank">
                            <Button
                                leftSection={
                                    <IconBrandNpm className="size-4" />
                                }
                                rightSection={
                                    <IconExternalLink className="size-4" />
                                }
                                className="text-dark-200 hover:text-white bg-dark-700 hover:bg-dark-600"
                            >
                                {packageInfo.name}
                            </Button>
                        </Link>
                    )}

                    {source && (
                        <Link to={source} target="_blank">
                            <Button
                                leftSection={
                                    <IconBrandGithub className="size-4" />
                                }
                                rightSection={
                                    <IconExternalLink className="size-4" />
                                }
                                className="text-dark-200 hover:text-white bg-dark-700 hover:bg-dark-600"
                            >
                                GitHub
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentationTitle;
