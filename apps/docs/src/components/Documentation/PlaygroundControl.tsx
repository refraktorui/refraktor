import type { ReactNode } from "react";

interface PlaygroundControlProps {
    label: string;
    hideLabel?: boolean;
    children: ReactNode;
}

function PlaygroundControl({
    label,
    hideLabel,
    children
}: PlaygroundControlProps) {
    return (
        <div className="flex flex-col gap-1 min-w-0">
            {!hideLabel && (
                <span className="text-xs font-medium text-white truncate">
                    {label}
                </span>
            )}
            <div>{children}</div>
        </div>
    );
}

export default PlaygroundControl;
