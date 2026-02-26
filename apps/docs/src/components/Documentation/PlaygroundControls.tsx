import type { ReactNode } from "react";

interface PlaygroundControlsProps {
    children: ReactNode;
}

function PlaygroundControls({ children }: PlaygroundControlsProps) {
    return <div className="px-3 py-4 flex flex-col gap-3">{children}</div>;
}

export default PlaygroundControls;
