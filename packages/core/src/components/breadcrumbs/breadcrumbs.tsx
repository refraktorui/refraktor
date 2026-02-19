import { useId, useUncontrolled } from "@refraktor/utils";
import { ChevronIcon } from "../../icons";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { getSize } from "./breadcrumbs.styles";
import {
    BreadcrumbsClassNames,
    BreadcrumbsFactoryPayload,
    BreadcrumbsProps
} from "./breadcrumbs.types";
import { buildBreadcrumbsRange } from "./breadcrumbs.utils";

const defaultProps = {
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    defaultExpanded: false,
    expandLabel: "Show full breadcrumb path",
    size: "md",
    radius: "default"
} satisfies Partial<BreadcrumbsProps>;

const Breadcrumbs = factory<BreadcrumbsFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        items,
        maxItems,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        expanded,
        defaultExpanded,
        onExpandedChange,
        expandLabel,
        separator,
        size,
        radius,
        className,
        classNames,
        ...props
    } = useProps("Breadcrumbs", defaultProps, _props);
    const classes = useClassNames("Breadcrumbs", classNames);
    const _id = useId(id);

    const [isExpanded, setIsExpanded] = useUncontrolled<boolean>({
        value: expanded,
        defaultValue: defaultExpanded,
        finalValue: false,
        onChange: onExpandedChange
    });

    const sizeStyles = getSize(size);
    const visibleItems = buildBreadcrumbsRange({
        total: items.length,
        maxItems,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        expanded: isExpanded
    });

    if (items.length === 0) {
        return null;
    }

    const resolvedSeparator =
        separator !== undefined ? (
            separator
        ) : (
            <ChevronIcon direction="right" size={sizeStyles.iconSize} />
        );

    return (
        <nav
            {...props}
            ref={ref}
            id={_id}
            aria-label={props["aria-label"] ?? "Breadcrumb"}
            className={cx("w-full", classes.root, className)}
        >
            <ol
                className={cx(
                    "flex flex-wrap items-center",
                    sizeStyles.list,
                    classes.list
                )}
            >
                {visibleItems.map((rangeItem, index) => {
                    const showSeparator = index < visibleItems.length - 1;
                    const content = (() => {
                        if (rangeItem === "collapse") {
                            return (
                                <button
                                    type="button"
                                    aria-label={expandLabel}
                                    className={cx(
                                        "inline-flex items-center justify-center select-none outline-none transition-colors",
                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                                        "text-[var(--refraktor-text-secondary)] hover:bg-[var(--refraktor-bg-hover)] hover:text-[var(--refraktor-text)]",
                                        sizeStyles.collapse,
                                        getRadius(radius),
                                        classes.collapse
                                    )}
                                    onClick={() => setIsExpanded(true)}
                                >
                                    ...
                                </button>
                            );
                        }

                        const item = items[rangeItem];
                        const isCurrent = rangeItem === items.length - 1;
                        const baseLabelClass = cx(
                            "inline-flex min-w-0 items-center truncate",
                            sizeStyles.label
                        );

                        if (!isCurrent && item.href) {
                            return (
                                <a
                                    href={item.href}
                                    target={item.target}
                                    rel={item.rel}
                                    aria-label={item.ariaLabel}
                                    className={cx(
                                        baseLabelClass,
                                        "outline-none transition-colors",
                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                                        "text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)]",
                                        classes.link
                                    )}
                                >
                                    {item.label}
                                </a>
                            );
                        }

                        return (
                            <span
                                aria-label={item.ariaLabel}
                                aria-current={isCurrent ? "page" : undefined}
                                className={cx(
                                    baseLabelClass,
                                    isCurrent
                                        ? "font-medium text-[var(--refraktor-text)]"
                                        : "text-[var(--refraktor-text-secondary)]",
                                    isCurrent ? classes.current : classes.link
                                )}
                            >
                                {item.label}
                            </span>
                        );
                    })();

                    return (
                        <li
                            key={
                                rangeItem === "collapse"
                                    ? "collapse"
                                    : `item-${rangeItem}`
                            }
                            className={cx(
                                "inline-flex min-w-0 items-center",
                                sizeStyles.item,
                                classes.item
                            )}
                        >
                            {content}

                            {showSeparator && (
                                <span
                                    aria-hidden="true"
                                    className={cx(
                                        "inline-flex items-center text-[var(--refraktor-text-tertiary)]",
                                        sizeStyles.separator,
                                        classes.separator
                                    )}
                                >
                                    {resolvedSeparator}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
});

Breadcrumbs.displayName = "@refraktor/core/Breadcrumbs";
Breadcrumbs.configure = createComponentConfig<BreadcrumbsProps>();
Breadcrumbs.classNames = createClassNamesConfig<BreadcrumbsClassNames>();

export default Breadcrumbs;
