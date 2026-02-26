import type { CSSProperties } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import type {
    ScrollAreaClassNames,
    ScrollAreaFactoryPayload,
    ScrollAreaOrientation,
    ScrollAreaProps
} from "./scroll-area.types";
import { useTheme } from "../../theme";

const defaultProps = {
    orientation: "vertical",
    scrollbarSize: 6
} satisfies Partial<ScrollAreaProps>;

function getOrientationStyles(orientation: ScrollAreaOrientation): string {
    if (orientation === "horizontal") {
        return "overflow-x-auto overflow-y-hidden";
    }

    if (orientation === "both") {
        return "overflow-auto";
    }

    return "overflow-y-auto overflow-x-hidden";
}

const ScrollArea = factory<ScrollAreaFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        orientation,
        scrollbarSize,
        className,
        classNames,
        style,
        ...props
    } = useProps("ScrollArea", defaultProps, _props);
    const classes = useClassNames("ScrollArea", classNames);

    const resolvedStyle = {
        ...(style ?? {}),
        "--refraktor-scrollbar-size": `${scrollbarSize}px`
    } as CSSProperties;

    return (
        <div
            ref={ref}
            className={cx(
                "refraktor-scrollbar",
                getOrientationStyles(orientation),
                classes.root,
                className
            )}
            style={resolvedStyle}
            {...props}
        />
    );
});

ScrollArea.displayName = "@refraktor/core/ScrollArea";
ScrollArea.configure = createComponentConfig<ScrollAreaProps>();
ScrollArea.classNames = createClassNamesConfig<ScrollAreaClassNames>();

export default ScrollArea;
