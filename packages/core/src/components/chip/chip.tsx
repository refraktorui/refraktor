import { useId, useUncontrolled } from "@refraktor/utils";
import { KeyboardEvent } from "react";
import { XIcon } from "../../icons";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { useChipGroupContext } from "./chip.context";
import { ChipGroup } from "./chip-group";
import { getSize, getVariant } from "./chip.styles";
import { ChipClassNames, ChipFactoryPayload, ChipProps } from "./chip.types";

const defaultProps = {
    size: "sm",
    radius: "full",
    variant: "default",
    selectable: false,
    removable: false
} satisfies Partial<ChipProps>;

const Chip = factory<ChipFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        children,
        selected,
        defaultSelected,
        onSelectedChange,
        selectable,
        removable,
        onRemove,
        removeButtonLabel,
        leftSection,
        rightSection,
        size,
        radius,
        variant,
        disabled,
        className,
        classNames,
        onClick,
        onKeyDown,
        ...props
    } = useProps("Chip", defaultProps, _props);
    const classes = useClassNames<ChipClassNames>("Chip", classNames);
    const chipGroup = useChipGroupContext();

    const _id = useId(id);

    const [uncontrolledSelected, setUncontrolledSelected] =
        useUncontrolled<boolean>({
            value: selected,
            defaultValue: defaultSelected,
            finalValue: false,
            onChange: onSelectedChange
        });

    const hasGroupValue = !!chipGroup && typeof value === "string";
    const isSelectable = selectable || hasGroupValue;
    const isRemovable = removable || typeof onRemove === "function";
    const isDisabled = !!(disabled || chipGroup?.disabled);
    const resolvedSize = size ?? chipGroup?.size ?? "sm";
    const resolvedRadius = radius ?? chipGroup?.radius ?? "full";
    const resolvedVariant = variant ?? chipGroup?.variant ?? "default";
    const isSelected = hasGroupValue
        ? chipGroup.value.includes(value)
        : uncontrolledSelected;

    const toggleChip = () => {
        if (!isSelectable || isDisabled) {
            return;
        }

        const nextSelected = !isSelected;

        if (hasGroupValue) {
            chipGroup.onValueChange(value, nextSelected);
            return;
        }

        setUncontrolledSelected(nextSelected);
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        toggleChip();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || isDisabled || !isSelectable) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleChip();
        }
    };

    const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (isDisabled) {
            return;
        }

        if (hasGroupValue) {
            chipGroup.onValueChange(value, false);
        } else if (isSelectable && isSelected) {
            setUncontrolledSelected(false);
        }

        onRemove?.(event);
    };

    return (
        <div
            ref={ref}
            id={_id}
            data-selected={isSelected}
            data-disabled={isDisabled}
            data-selectable={isSelectable}
            data-removable={isRemovable}
            role={isSelectable ? "button" : undefined}
            tabIndex={isSelectable ? (isDisabled ? -1 : 0) : undefined}
            aria-pressed={isSelectable ? isSelected : undefined}
            aria-disabled={isDisabled || undefined}
            className={cx(
                "inline-flex w-fit max-w-full items-center justify-center border select-none transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
                isSelectable ? "cursor-pointer" : "cursor-default",
                getSize(resolvedSize),
                getRadius(resolvedRadius),
                getVariant(resolvedVariant, isSelected),
                classes.root,
                className
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {leftSection && (
                <span
                    className={cx(
                        "inline-flex shrink-0 items-center justify-center",
                        classes.leftSection
                    )}
                    aria-hidden="true"
                >
                    {leftSection}
                </span>
            )}

            <span className={cx("truncate", classes.label)}>{children}</span>

            {rightSection && (
                <span
                    className={cx(
                        "inline-flex shrink-0 items-center justify-center",
                        classes.rightSection
                    )}
                    aria-hidden="true"
                >
                    {rightSection}
                </span>
            )}

            {isRemovable && (
                <button
                    type="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-label={removeButtonLabel ?? "Remove chip"}
                    className={cx(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 cursor-pointer",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                        classes.removeButton
                    )}
                    onClick={handleRemove}
                    disabled={isDisabled}
                >
                    <span className={cx("inline-flex", classes.removeIcon)}>
                        <XIcon size={12} />
                    </span>
                </button>
            )}
        </div>
    );
});

Chip.displayName = "@refraktor/core/Chip";
Chip.configure = createComponentConfig<ChipProps>();
Chip.classNames = createClassNamesConfig<ChipClassNames>();
Chip.Group = ChipGroup;

export default Chip;
