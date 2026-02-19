import { useId, useUncontrolled } from "@refraktor/utils";
import { KeyboardEvent, useMemo, useRef } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { getSize } from "./segmented-control.styles";
import {
    SegmentedControlClassNames,
    SegmentedControlFactoryPayload,
    SegmentedControlProps
} from "./segmented-control.types";

const defaultProps = {
    size: "md",
    radius: "default",
    fullWidth: false,
    disabled: false
} satisfies Partial<SegmentedControlProps>;

const SegmentedControl = factory<SegmentedControlFactoryPayload>(
    (_props, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            id,
            data,
            value,
            defaultValue,
            onChange,
            size,
            radius,
            fullWidth,
            disabled,
            name,
            className,
            classNames,
            ...props
        } = useProps("SegmentedControl", defaultProps, _props);
        const classes = useClassNames("SegmentedControl", classNames);
        const _id = useId(id);

        const firstEnabledValue = useMemo(
            () => data.find((item) => !item.disabled)?.value ?? "",
            [data]
        );

        const [selectedValue, setSelectedValue] = useUncontrolled<string>({
            value,
            defaultValue,
            finalValue: firstEnabledValue,
            onChange
        });

        const sizeStyles = getSize(size);
        const controlRefs = useRef<Array<HTMLButtonElement | null>>([]);

        const enabledIndexes = useMemo(() => {
            const indexes: number[] = [];

            data.forEach((item, index) => {
                if (!item.disabled) {
                    indexes.push(index);
                }
            });

            return indexes;
        }, [data]);

        const activeIndex = useMemo(
            () => data.findIndex((item) => item.value === selectedValue),
            [data, selectedValue]
        );

        const tabStopIndex = useMemo(() => {
            if (activeIndex !== -1 && !data[activeIndex]?.disabled) {
                return activeIndex;
            }

            return enabledIndexes[0] ?? -1;
        }, [activeIndex, data, enabledIndexes]);

        const selectByIndex = (index: number) => {
            const item = data[index];

            if (
                !item ||
                disabled ||
                item.disabled ||
                item.value === selectedValue
            ) {
                return;
            }

            setSelectedValue(item.value);
        };

        const moveSelection = (currentIndex: number, direction: 1 | -1) => {
            if (disabled || enabledIndexes.length === 0) {
                return;
            }

            const currentEnabledPosition = enabledIndexes.indexOf(currentIndex);
            const basePosition =
                currentEnabledPosition === -1 ? 0 : currentEnabledPosition;
            const nextPosition =
                (basePosition + direction + enabledIndexes.length) %
                enabledIndexes.length;
            const nextIndex = enabledIndexes[nextPosition];

            selectByIndex(nextIndex);
            controlRefs.current[nextIndex]?.focus();
        };

        const handleKeyDown = (
            event: KeyboardEvent<HTMLButtonElement>,
            index: number,
            isControlDisabled: boolean
        ) => {
            if (event.defaultPrevented || disabled || isControlDisabled) {
                return;
            }

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveSelection(index, 1);
                return;
            }

            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveSelection(index, -1);
                return;
            }

            if (event.key === "Home") {
                event.preventDefault();

                const firstEnabledIndex = enabledIndexes[0];

                if (firstEnabledIndex !== undefined) {
                    selectByIndex(firstEnabledIndex);
                    controlRefs.current[firstEnabledIndex]?.focus();
                }

                return;
            }

            if (event.key === "End") {
                event.preventDefault();

                const lastEnabledIndex =
                    enabledIndexes[enabledIndexes.length - 1];

                if (lastEnabledIndex !== undefined) {
                    selectByIndex(lastEnabledIndex);
                    controlRefs.current[lastEnabledIndex]?.focus();
                }
            }
        };

        return (
            <div
                ref={ref}
                id={_id}
                role="radiogroup"
                data-disabled={disabled}
                aria-disabled={disabled}
                className={cx(
                    "relative inline-flex items-stretch border border-[var(--refraktor-border)]",
                    "bg-[var(--refraktor-bg-subtle)]",
                    "data-[disabled=true]:opacity-50",
                    fullWidth && "w-full",
                    sizeStyles.root,
                    getRadius(radius),
                    classes.root,
                    className
                )}
                {...props}
            >
                {data.map((item, index) => {
                    const isActive = item.value === selectedValue;
                    const isControlDisabled = !!(disabled || item.disabled);

                    return (
                        <button
                            key={item.value}
                            ref={(node) => {
                                controlRefs.current[index] = node;
                            }}
                            type="button"
                            role="radio"
                            id={`${_id}-control-${index}`}
                            aria-checked={isActive}
                            aria-disabled={isControlDisabled}
                            data-active={isActive}
                            data-disabled={isControlDisabled}
                            disabled={isControlDisabled}
                            tabIndex={
                                isControlDisabled || tabStopIndex !== index
                                    ? -1
                                    : 0
                            }
                            className={cx(
                                "relative inline-flex items-center justify-center whitespace-nowrap select-none outline-none transition-colors",
                                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                                "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                                fullWidth && "flex-1",
                                sizeStyles.control,
                                sizeStyles.label,
                                getRadius(radius),
                                isActive
                                    ? "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]"
                                    : "text-[var(--refraktor-text-secondary)] hover:bg-[var(--refraktor-bg-hover)] hover:text-[var(--refraktor-text)]",
                                classes.control
                            )}
                            onClick={() => selectByIndex(index)}
                            onKeyDown={(event) =>
                                handleKeyDown(event, index, isControlDisabled)
                            }
                        >
                            <span className={cx("leading-none", classes.label)}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                {name && (
                    <input type="hidden" name={name} value={selectedValue} />
                )}
            </div>
        );
    }
);

SegmentedControl.displayName = "@refraktor/core/SegmentedControl";
SegmentedControl.configure = createComponentConfig<SegmentedControlProps>();
SegmentedControl.classNames =
    createClassNamesConfig<SegmentedControlClassNames>();

export default SegmentedControl;
