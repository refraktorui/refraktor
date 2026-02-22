import type { ReactNode } from "react";
import DocumentationTitle from "./DocumentationTitle";
import DocumentationSection from "./DocumentationSection";
import DocumentationTabs from "./DocumentationTabs";
import DocumentationTab from "./DocumentationTab";
import PropsWrapper from "./PropsWrapper";
import PropsContent from "./PropsContent";

interface DocumentationProps {
    children: ReactNode;
}

function Documentation({ children }: DocumentationProps) {
    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8 py-4">
            {children}
        </div>
    );
}

const Props = Object.assign(PropsWrapper, {
    Content: PropsContent
});

Documentation.Title = DocumentationTitle;
Documentation.Section = DocumentationSection;
Documentation.Tabs = DocumentationTabs;
Documentation.Tab = DocumentationTab;
Documentation.Props = Props;

export default Documentation;
