import { clamp, useId, useUncontrolled } from "@refraktor/utils";
import { useMemo } from "react";
import { ChevronIcon } from "../../icons";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { getSize, getVariant } from "./pagination.styles";
import {
    PaginationAriaLabelType,
    PaginationClassNames,
    PaginationFactoryPayload,
    PaginationProps
} from "./pagination.types";
import { buildPaginationRange } from "./pagination.utils";

const defaultProps = {
    siblings: 1,
    boundaries: 1,
    withControls: true,
    withEdges: false,
    hideWithOnePage: false,
    disabled: false,
    size: "md",
    radius: "default",
    variant: "default"
} satisfies Partial<PaginationProps>;

const getSafeNumber = (value: number, fallback: number, minimum = 0) => {
    if (!Number.isFinite(value)) {
        return fallback;
    }

    return Math.max(minimum, Math.trunc(value));
};

const getDefaultAriaLabel = (
    type: PaginationAriaLabelType,
    page: number,
    selected: boolean
) => {
    if (type === "page") {
        return selected ? `Page ${page}, current page` : `Go to page ${page}`;
    }

    if (type === "first") {
        return "Go to first page";
    }

    if (type === "previous") {
        return "Go to previous page";
    }

    if (type === "next") {
        return "Go to next page";
    }

    return "Go to last page";
};

const Pagination = factory<PaginationFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        total,
        value,
        defaultValue,
        onChange,
        siblings,
        boundaries,
        withControls,
        withEdges,
        hideWithOnePage,
        disabled,
        size,
        radius,
        variant,
        getItemAriaLabel,
        className,
        classNames,
        ...props
    } = useProps("Pagination", defaultProps, _props);
    const classes = useClassNames("Pagination", classNames);
    const _id = useId(id);

    const totalPages = getSafeNumber(total, 0, 0);
    const safeSiblings = getSafeNumber(siblings, 1, 0);
    const safeBoundaries = getSafeNumber(boundaries, 1, 0);

    const [currentPage, setCurrentPage] = useUncontrolled<number>({
        value,
        defaultValue,
        finalValue: 1,
        onChange
    });

    const activePage =
        totalPages > 0
            ? clamp(getSafeNumber(currentPage, 1, 1), 1, totalPages)
            : 1;

    const items = useMemo(
        () =>
            buildPaginationRange({
                total: totalPages,
                page: activePage,
                siblings: safeSiblings,
                boundaries: safeBoundaries
            }),
        [totalPages, activePage, safeSiblings, safeBoundaries]
    );

    if (totalPages === 0) {
        return null;
    }

    if (hideWithOnePage && totalPages === 1) {
        return null;
    }

    const sizeStyles = getSize(size);
    const variantStyles = getVariant(variant);

    const resolveAriaLabel = (
        type: PaginationAriaLabelType,
        page: number,
        selected = false
    ) => {
        if (getItemAriaLabel) {
            return getItemAriaLabel(type, page, selected);
        }

        return getDefaultAriaLabel(type, page, selected);
    };

    const canGoPrevious = !disabled && activePage > 1;
    const canGoNext = !disabled && activePage < totalPages;

    const handlePageChange = (nextPage: number) => {
        if (disabled || totalPages === 0) {
            return;
        }

        const normalizedPage = clamp(nextPage, 1, totalPages);

        if (normalizedPage === activePage) {
            return;
        }

        setCurrentPage(normalizedPage);
    };

    const getControlClassName = (
        state: { disabled: boolean },
        className?: string
    ) =>
        cx(
            "inline-flex items-center justify-center select-none outline-none transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
            "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
            sizeStyles.item,
            getRadius(radius),
            variantStyles.base,
            variantStyles.inactive,
            classes.control,
            className,
            !state.disabled && "cursor-pointer"
        );

    const getPageClassName = (state: { active: boolean }) =>
        cx(
            "inline-flex items-center justify-center select-none outline-none transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
            "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
            sizeStyles.item,
            getRadius(radius),
            variantStyles.base,
            state.active ? variantStyles.active : variantStyles.inactive,
            classes.page,
            !disabled && "cursor-pointer"
        );

    return (
        <nav
            {...props}
            ref={ref}
            id={_id}
            role="navigation"
            aria-label="Pagination"
            className={cx("w-full", classes.root, className)}
        >
            <ul
                className={cx(
                    "inline-flex items-center",
                    sizeStyles.list,
                    classes.list
                )}
            >
                {withControls && withEdges && (
                    <li className={cx(classes.item)}>
                        <button
                            type="button"
                            aria-label={resolveAriaLabel("first", 1, false)}
                            aria-disabled={!canGoPrevious}
                            data-disabled={!canGoPrevious}
                            disabled={!canGoPrevious}
                            className={getControlClassName(
                                { disabled: !canGoPrevious },
                                classes.first
                            )}
                            onClick={() => handlePageChange(1)}
                        >
                            <span className="inline-flex items-center -space-x-2">
                                <ChevronIcon
                                    direction="left"
                                    size={sizeStyles.iconSize}
                                />
                                <ChevronIcon
                                    direction="left"
                                    size={sizeStyles.iconSize}
                                />
                            </span>
                        </button>
                    </li>
                )}

                {withControls && (
                    <li className={cx(classes.item)}>
                        <button
                            type="button"
                            aria-label={resolveAriaLabel(
                                "previous",
                                Math.max(1, activePage - 1),
                                false
                            )}
                            aria-disabled={!canGoPrevious}
                            data-disabled={!canGoPrevious}
                            disabled={!canGoPrevious}
                            className={getControlClassName(
                                { disabled: !canGoPrevious },
                                classes.previous
                            )}
                            onClick={() => handlePageChange(activePage - 1)}
                        >
                            <ChevronIcon
                                direction="left"
                                size={sizeStyles.iconSize}
                            />
                        </button>
                    </li>
                )}

                {items.map((item, index) => {
                    if (typeof item !== "number") {
                        return (
                            <li
                                key={`${item}-${index}`}
                                className={cx(classes.item)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cx(
                                        "inline-flex items-center justify-center select-none text-[var(--refraktor-text-tertiary)]",
                                        sizeStyles.dots,
                                        classes.dots
                                    )}
                                >
                                    ...
                                </span>
                            </li>
                        );
                    }

                    const isActive = item === activePage;

                    return (
                        <li key={item} className={cx(classes.item)}>
                            <button
                                type="button"
                                aria-label={resolveAriaLabel(
                                    "page",
                                    item,
                                    isActive
                                )}
                                aria-current={isActive ? "page" : undefined}
                                aria-disabled={disabled}
                                data-active={isActive}
                                data-disabled={disabled}
                                disabled={disabled}
                                className={getPageClassName({
                                    active: isActive
                                })}
                                onClick={() => handlePageChange(item)}
                            >
                                {item}
                            </button>
                        </li>
                    );
                })}

                {withControls && (
                    <li className={cx(classes.item)}>
                        <button
                            type="button"
                            aria-label={resolveAriaLabel(
                                "next",
                                Math.min(totalPages, activePage + 1),
                                false
                            )}
                            aria-disabled={!canGoNext}
                            data-disabled={!canGoNext}
                            disabled={!canGoNext}
                            className={getControlClassName(
                                { disabled: !canGoNext },
                                classes.next
                            )}
                            onClick={() => handlePageChange(activePage + 1)}
                        >
                            <ChevronIcon
                                direction="right"
                                size={sizeStyles.iconSize}
                            />
                        </button>
                    </li>
                )}

                {withControls && withEdges && (
                    <li className={cx(classes.item)}>
                        <button
                            type="button"
                            aria-label={resolveAriaLabel(
                                "last",
                                totalPages,
                                false
                            )}
                            aria-disabled={!canGoNext}
                            data-disabled={!canGoNext}
                            disabled={!canGoNext}
                            className={getControlClassName(
                                { disabled: !canGoNext },
                                classes.last
                            )}
                            onClick={() => handlePageChange(totalPages)}
                        >
                            <span className="inline-flex items-center -space-x-2">
                                <ChevronIcon
                                    direction="right"
                                    size={sizeStyles.iconSize}
                                />
                                <ChevronIcon
                                    direction="right"
                                    size={sizeStyles.iconSize}
                                />
                            </span>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
});

Pagination.displayName = "@refraktor/core/Pagination";
Pagination.configure = createComponentConfig<PaginationProps>();
Pagination.classNames = createClassNamesConfig<PaginationClassNames>();

export default Pagination;
