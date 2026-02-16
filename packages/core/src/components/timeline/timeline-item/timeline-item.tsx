import { CSSProperties } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTimelineContext } from "../timeline.context";
import { getConnector, getSize, getStatus } from "../timeline.styles";
import { TimelineItemFactoryPayload } from "../timeline.types";

const TimelineItem = factory<TimelineItemFactoryPayload>(
    (
        {
            date,
            title,
            bullet,
            line = true,
            children,
            className,
            __timelineIndex,
            __timelineCount,
            ...props
        },
        ref
    ) => {
        const { cx, getRadius } = useTheme();
        const { orientation, size, radius, lineVariant, active, getStyles } =
            useTimelineContext();

        const isActive =
            typeof __timelineIndex === "number" &&
            active >= 0 &&
            __timelineIndex <= active;

        const sizeStyles = getSize(size);
        const statusStyles = getStatus(isActive);
        const connectorStyles = getConnector(lineVariant, orientation);

        const isLast =
            typeof __timelineIndex === "number" &&
            typeof __timelineCount === "number" &&
            __timelineIndex === __timelineCount - 1;
        const showConnector = line && !isLast;

        const connectorColorStyle = {
            "--refraktor-timeline-connector-color": statusStyles.connectorColor
        } as CSSProperties;

        return (
            <div
                ref={ref}
                role="listitem"
                data-active={isActive}
                data-orientation={orientation}
                className={cx(
                    "min-w-0",
                    orientation === "horizontal"
                        ? "flex-1 flex flex-col"
                        : "flex items-stretch last:pb-0",
                    orientation === "vertical" && sizeStyles.itemSpacing,
                    sizeStyles.itemGap,
                    getStyles("item"),
                    className
                )}
                {...props}
            >
                <div
                    className={cx(
                        "shrink-0",
                        orientation === "horizontal"
                            ? "w-full flex items-center"
                            : "h-full self-stretch flex flex-col items-center",
                        orientation === "vertical" && sizeStyles.bulletWrapper,
                        getStyles("bulletWrapper")
                    )}
                >
                    <span
                        data-timeline-bullet="true"
                        className={cx(
                            "inline-flex items-center justify-center",
                            "select-none",
                            sizeStyles.bullet,
                            getRadius(radius),
                            statusStyles.bullet,
                            getStyles("bullet")
                        )}
                    >
                        {bullet && bullet}
                    </span>

                    {showConnector && (
                        <span
                            aria-hidden="true"
                            data-timeline-connector="true"
                            style={connectorColorStyle}
                            className={cx(
                                connectorStyles,
                                orientation === "vertical" &&
                                    sizeStyles.connectorExtend,
                                getStyles("connector")
                            )}
                        />
                    )}
                </div>

                <div
                    className={cx(
                        "min-w-0 flex flex-col",
                        orientation === "horizontal" && "mt-1",
                        sizeStyles.contentGap,
                        getStyles("content")
                    )}
                >
                    {date && (
                        <div
                            data-timeline-date="true"
                            className={cx(
                                "leading-none",
                                sizeStyles.date,
                                statusStyles.date,
                                getStyles("date")
                            )}
                        >
                            {date}
                        </div>
                    )}

                    {title && (
                        <div
                            className={cx(
                                "font-medium leading-tight",
                                sizeStyles.title,
                                statusStyles.title,
                                getStyles("title")
                            )}
                        >
                            {title}
                        </div>
                    )}

                    {children !== undefined && children !== null && (
                        <div
                            className={cx(
                                "leading-snug",
                                sizeStyles.description,
                                statusStyles.description,
                                getStyles("description")
                            )}
                        >
                            {children}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

TimelineItem.displayName = "@refraktor/core/Timeline.Item";

export default TimelineItem;
