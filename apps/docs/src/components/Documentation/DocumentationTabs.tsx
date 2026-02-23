import { useState, Children, isValidElement, type ReactNode } from "react";
import { SegmentedControl } from "@refraktor/core";
import DocumentationTab, {
    type DocumentationTabProps
} from "./DocumentationTab";
import {
    IconBook2,
    IconComponents,
    IconListDetails
} from "@tabler/icons-react";

interface DocumentationTabsProps {
    children: ReactNode;
    defaultTab?: string;
}

function DocumentationTabs({ children, defaultTab }: DocumentationTabsProps) {
    const tabs = Children.toArray(children)
        .filter(isValidElement)
        .filter((el) => el.type === DocumentationTab)
        .map((el) => {
            const props = el.props as DocumentationTabProps;
            return {
                id: props.id,
                content: props.children
            };
        });

    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

    const activeContent = tabs.find((t) => t.id === activeTab)?.content;

    const getLabel = (id: string) => {
        switch (id) {
            case "docs":
                return "Docs";
            case "props":
                return "Props";
            case "classes":
                return "Classes";
        }
    };

    const getIcon = (id: string) => {
        switch (id) {
            case "docs":
                return <IconBook2 className="size-5" />;
            case "props":
                return <IconListDetails className="size-5" />;
            case "classes":
                return <IconComponents className="size-5" />;
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <SegmentedControl
                data={tabs.map((tab) => ({
                    value: tab.id,
                    label: getLabel(tab.id),
                    icon: getIcon(tab.id)
                }))}
                value={activeTab}
                onChange={(value) => setActiveTab(value)}
                classNames={{
                    root: "w-fit",
                    control: "rounded-sm"
                }}
                size="lg"
            />

            <div className="flex flex-col gap-12">{activeContent}</div>
        </div>
    );
}

export default DocumentationTabs;
