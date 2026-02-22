import type { ReactNode } from "react";

interface PlaygroundPreviewProps {
    children: ReactNode;
}

function PlaygroundPreview({ children }: PlaygroundPreviewProps) {
    return (
        <div className="flex items-center justify-center p-8 min-h-full">
            {children}
        </div>
    );
}

export default PlaygroundPreview;
