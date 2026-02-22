import type { ReactNode } from "react";

export interface DocumentationTabProps {
    id: string;
    children: ReactNode;
}

function DocumentationTab({ children }: DocumentationTabProps) {
    return <>{children}</>;
}

export default DocumentationTab;
