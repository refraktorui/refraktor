import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useTheme,
    useClassNames,
    useProps
} from "@refraktor/core";
import { getPickerSizeStyles } from "./picker.styles";
import {
    PickerHeaderClassNames,
    PickerHeaderFactoryPayload,
    PickerHeaderProps
} from "./picker-header.types";

const defaultProps = {
    previousDisabled: false,
    nextDisabled: false,
    previousLabel: "Show previous period",
    nextLabel: "Show next period",
    size: "md",
    radius: "default"
} satisfies Partial<PickerHeaderProps>;

const ChevronIcon = ({
    direction,
    size
}: {
    direction: "left" | "right";
    size: number;
}) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        width={size}
        height={size}
        className={direction === "right" ? "rotate-180" : undefined}
    >
        <path
            d="M9.5 3.5L5 8l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const PickerHeader = factory<PickerHeaderFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        label,
        onPrevious,
        onNext,
        onLabelClick,
        previousDisabled,
        nextDisabled,
        previousLabel,
        nextLabel,
        size,
        radius,
        className,
        classNames,
        ...props
    } = useProps("PickerHeader", defaultProps, _props);
    const classes = useClassNames("PickerHeader", classNames);
    const sizeStyles = getPickerSizeStyles(size);
    const radiusStyles = getRadius(radius);

    const isPreviousDisabled = previousDisabled || !onPrevious;
    const isNextDisabled = nextDisabled || !onNext;

    const getStyles = (part: keyof PickerHeaderClassNames) => classes[part];

    return (
        <div
            ref={ref}
            className={cx(
                "flex items-center justify-between gap-2",
                getStyles("root"),
                className
            )}
            {...props}
        >
            <div
                className={cx(
                    "inline-flex shrink-0 items-center gap-1",
                    getStyles("controls")
                )}
            >
                <button
                    type="button"
                    aria-label={previousLabel}
                    aria-disabled={isPreviousDisabled}
                    data-disabled={isPreviousDisabled}
                    disabled={isPreviousDisabled}
                    onClick={onPrevious}
                    className={cx(
                        "inline-flex items-center justify-center cursor-pointer",
                        "text-[var(--refraktor-text)] transition-colors hover:bg-[var(--refraktor-bg-hover)]",
                        "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                        sizeStyles.control,
                        radiusStyles,
                        getStyles("control"),
                        getStyles("previousControl")
                    )}
                >
                    <ChevronIcon direction="left" size={sizeStyles.iconSize} />
                </button>
            </div>

            <div
                className={cx(
                    "min-w-0 flex-1 truncate text-center font-medium text-[var(--refraktor-text)]",
                    sizeStyles.label,
                    getStyles("label")
                )}
            >
                {onLabelClick ? (
                    <button
                        type="button"
                        onClick={onLabelClick}
                        className={cx(
                            "inline-flex w-full cursor-pointer items-center justify-center text-center transition-colors hover:bg-[var(--refraktor-bg-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                            sizeStyles.labelButton,
                            radiusStyles,
                            getStyles("labelButton")
                        )}
                    >
                        <span
                            className={cx("truncate", getStyles("labelText"))}
                        >
                            {label}
                        </span>
                    </button>
                ) : (
                    <span className={cx("truncate", getStyles("labelText"))}>
                        {label}
                    </span>
                )}
            </div>

            <div
                className={cx(
                    "inline-flex shrink-0 items-center gap-1",
                    getStyles("controls")
                )}
            >
                <button
                    type="button"
                    aria-label={nextLabel}
                    aria-disabled={isNextDisabled}
                    data-disabled={isNextDisabled}
                    disabled={isNextDisabled}
                    onClick={onNext}
                    className={cx(
                        "inline-flex items-center justify-center cursor-pointer",
                        "text-[var(--refraktor-text)] transition-colors hover:bg-[var(--refraktor-bg-hover)]",
                        "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                        sizeStyles.control,
                        radiusStyles,
                        getStyles("control"),
                        getStyles("nextControl")
                    )}
                >
                    <ChevronIcon direction="right" size={sizeStyles.iconSize} />
                </button>
            </div>
        </div>
    );
});

PickerHeader.displayName = "@refraktor/dates/PickerHeader";
PickerHeader.configure = createComponentConfig<PickerHeaderProps>();
PickerHeader.classNames = createClassNamesConfig<PickerHeaderClassNames>();

export default PickerHeader;
