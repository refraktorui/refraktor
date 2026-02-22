import type { ReactNode } from "react";

interface PlaygroundWrapperProps {
    children: ReactNode;
}

function PlaygroundWrapper({ children }: PlaygroundWrapperProps) {
    return (
        <div className="rounded-md border border-dark-600 overflow-hidden bg-dark-800 [&>*+*]:border-t [&>*+*]:border-dark-600">
            {children}
        </div>
    );
}

export default PlaygroundWrapper;
