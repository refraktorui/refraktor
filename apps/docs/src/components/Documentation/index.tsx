import type { ReactNode } from "react";
import DocumentationTitle from "./DocumentationTitle";
import DocumentationSection from "./DocumentationSection";
import DocumentationTabs from "./DocumentationTabs";
import DocumentationTab from "./DocumentationTab";
import PropsWrapper from "./PropsWrapper";
import PropsContent from "./PropsContent";
import PlaygroundWrapper from "./PlaygroundWrapper";
import PlaygroundPreview from "./PlaygroundPreview";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundControl from "./PlaygroundControl";
import PlaygroundCode from "./PlaygroundCode";
import { ClassesInspector } from "./ClassesInspector";

export { createPlayground } from "./createPlayground";
export type { ClassesInspectorProps, SlotName } from "./ClassesInspector";

interface DocumentationProps {
    children: ReactNode;
}

function Documentation({ children }: DocumentationProps) {
    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-8 py-4">
            {children}
        </div>
    );
}

const Props = Object.assign(PropsWrapper, {
    Content: PropsContent
});

const Playground = Object.assign(PlaygroundWrapper, {
    Preview: PlaygroundPreview,
    Controls: PlaygroundControls,
    Control: PlaygroundControl,
    Code: PlaygroundCode
});

Documentation.Title = DocumentationTitle;
Documentation.Section = DocumentationSection;
Documentation.Tabs = DocumentationTabs;
Documentation.Tab = DocumentationTab;
Documentation.Props = Props;
Documentation.Playground = Playground;
Documentation.ClassesInspector = ClassesInspector;

export default Documentation;
