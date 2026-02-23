import type { ReactNode } from "react";
import PlaygroundPreview from "./PlaygroundPreview";
import PlaygroundCode from "./PlaygroundCode";

interface DocumentationShowcaseProps {
    children: ReactNode;
    code: string;
    language?: string;
    filename?: string;
}

function DocumentationShowcase({
    children,
    code,
    language = "tsx",
    filename = "Demo.tsx"
}: DocumentationShowcaseProps) {
    return (
        <div className="rounded-xl border border-dark-600 overflow-hidden bg-dark-800 [&>*+*]:border-t [&>*+*]:border-dark-600">
            <PlaygroundPreview>{children}</PlaygroundPreview>
            <PlaygroundCode code={code} language={language} filename={filename} />
        </div>
    );
}

export default DocumentationShowcase;
