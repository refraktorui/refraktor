import { useId, useUncontrolled } from "@refraktor/utils";
import { useCallback, useEffect } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { TabsList } from "./tabs-list";
import { TabsPanel } from "./tabs-panel";
import {
    getNavigableTabs,
    TabsProvider,
    useTabsRegistry
} from "./tabs.context";
import { TabsTab } from "./tabs-tab";
import { TabsClassNames, TabsFactoryPayload, TabsProps } from "./tabs.types";

const defaultProps = {
    orientation: "horizontal",
    activationMode: "automatic",
    loop: true,
    keepMounted: false,
    size: "md",
    radius: "default",
    variant: "underline"
} satisfies Partial<TabsProps>;

const toDomSafeValue = (value: string) =>
    encodeURIComponent(value).replace(/%/g, "-");

const Tabs = factory<TabsFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        value,
        defaultValue,
        onChange,
        orientation,
        activationMode,
        loop,
        keepMounted,
        size,
        radius,
        variant,
        className,
        classNames,
        ...props
    } = useProps("Tabs", defaultProps, _props);
    const classes = useClassNames("Tabs", classNames);
    const _id = useId(id);

    const [activeValue, setActiveValue, isControlled] = useUncontrolled<string>(
        {
            value,
            defaultValue,
            finalValue: "",
            onChange
        }
    );

    const { registerTab, getTabs } = useTabsRegistry();

    useEffect(() => {
        if (isControlled || activeValue) {
            return;
        }

        const firstTab = getNavigableTabs(getTabs())[0];

        if (firstTab) {
            setActiveValue(firstTab.value);
        }
    }, [isControlled, activeValue, getTabs, setActiveValue]);

    const getTabId = useCallback(
        (tabValue: string) => `${_id}-tab-${toDomSafeValue(tabValue)}`,
        [_id]
    );

    const getPanelId = useCallback(
        (tabValue: string) => `${_id}-panel-${toDomSafeValue(tabValue)}`,
        [_id]
    );

    const getStyles = useCallback(
        (part: keyof TabsClassNames) => classes[part],
        [classes]
    );

    return (
        <TabsProvider
            value={{
                value: activeValue,
                onValueChange: setActiveValue,
                orientation,
                activationMode,
                loop,
                keepMounted,
                size,
                radius,
                variant,
                registerTab,
                getTabs,
                getTabId,
                getPanelId,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx(
                    "w-full",
                    orientation === "vertical" && "flex items-start gap-3",
                    classes.root,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </TabsProvider>
    );
});

Tabs.displayName = "@refraktor/core/Tabs";
Tabs.configure = createComponentConfig<TabsProps>();
Tabs.classNames = createClassNamesConfig<TabsClassNames>();
Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export default Tabs;
