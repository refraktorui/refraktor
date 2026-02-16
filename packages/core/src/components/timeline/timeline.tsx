import { useId } from "@refraktor/utils";
import {
    Children,
    ReactElement,
    ReactNode,
    cloneElement,
    isValidElement,
    useCallback,
    useMemo
} from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { TimelineProvider } from "./timeline.context";
import { getSize } from "./timeline.styles";
import { TimelineItem } from "./timeline-item";
import {
    TimelineClassNames,
    TimelineFactoryPayload,
    TimelineItemProps,
    TimelineProps
} from "./timeline.types";

const defaultProps = {
    orientation: "vertical",
    size: "md",
    radius: "full",
    lineVariant: "solid",
    active: -1
} satisfies Partial<TimelineProps>;

const isTimelineItemElement = (
    child: ReactNode
): child is ReactElement<TimelineItemProps> =>
    isValidElement(child) && child.type === TimelineItem;

const Timeline = factory<TimelineFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        orientation,
        size,
        radius,
        lineVariant,
        active,
        className,
        classNames,
        ...props
    } = useProps("Timeline", defaultProps, _props);
    const classes = useClassNames("Timeline", classNames);
    const _id = useId(id);

    const sizeStyles = getSize(size);

    const resolvedChildren = useMemo(() => {
        const items = Children.toArray(children);
        const itemCount = items.filter(isTimelineItemElement).length;
        let itemIndex = 0;

        return items.map((child) => {
            if (!isTimelineItemElement(child)) {
                return child;
            }

            const nextChild = cloneElement(child, {
                __timelineIndex: itemIndex,
                __timelineCount: itemCount
            });

            itemIndex += 1;
            return nextChild;
        });
    }, [children]);

    const getStyles = useCallback(
        (part: keyof TimelineClassNames) => classes[part],
        [classes]
    );

    return (
        <TimelineProvider
            value={{
                orientation,
                size,
                radius,
                lineVariant,
                active,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                role="list"
                data-orientation={orientation}
                className={cx(
                    "w-full",
                    orientation === "horizontal"
                        ? "flex items-start"
                        : "flex flex-col",
                    orientation === "horizontal" && sizeStyles.rootGap,
                    classes.root,
                    className
                )}
                {...props}
            >
                {resolvedChildren}
            </div>
        </TimelineProvider>
    );
});

Timeline.displayName = "@refraktor/core/Timeline";
Timeline.configure = createComponentConfig<TimelineProps>();
Timeline.classNames = createClassNamesConfig<TimelineClassNames>();
Timeline.Item = TimelineItem;

export default Timeline;
