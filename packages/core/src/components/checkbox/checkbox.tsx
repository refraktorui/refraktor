import { useEffect, useRef } from "react";
import { useId, useMergedRefs, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { CheckIcon, MinusIcon } from "../../icons";
import { CheckboxGroup } from "./checkbox-group";
import { useCheckboxGroupContext } from "./checkbox.context";
import {
    CheckboxClassNames,
    CheckboxFactoryPayload,
    CheckboxProps
} from "./checkbox.types";
import { getSize } from "./checkbox.styles";

const defaultProps = {
    labelPosition: "right"
} satisfies Partial<CheckboxProps>;

const Checkbox = factory<CheckboxFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        checked,
        defaultChecked,
        onChange,
        indeterminate,
        value,
        name,
        size,
        radius,
        disabled,
        label,
        labelPosition,
        description,
        error,
        className,
        classNames,
        ...props
    } = useProps("Checkbox", defaultProps, _props);
    const classes = useClassNames("Checkbox", classNames);
    const groupContext = useCheckboxGroupContext();

    const [uncontrolledValue, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false
    });

    const _id = useId(id);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    const hasGroupValue = !!groupContext && typeof value === "string";
    const isChecked = hasGroupValue
        ? groupContext.value.includes(value)
        : uncontrolledValue;
    const isIndeterminate = !!indeterminate;
    const isDisabled = !!(disabled || groupContext?.disabled);

    const resolvedName = name ?? groupContext?.name;
    const resolvedSize = size ?? groupContext?.size ?? "md";
    const resolvedRadius = radius ?? groupContext?.radius ?? "sm";
    const sizeClass = getSize(resolvedSize);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate, isChecked]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextChecked = event.currentTarget.checked;

        if (hasGroupValue) {
            groupContext.onValueChange(value, nextChecked);
        } else {
            handleChange(nextChecked);
        }

        onChange?.(event);
    };

    return (
        <div className={cx("inline-flex flex-col", classes.root, className)}>
            <label
                className={cx(
                    "inline-flex items-center select-none w-fit",
                    sizeClass.gap,
                    isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                    labelPosition === "left" ? "flex-row-reverse" : "flex-row",
                    classes.body
                )}
                htmlFor={_id}
            >
                <input
                    {...props}
                    id={_id}
                    ref={mergedRef}
                    type="checkbox"
                    value={value}
                    name={resolvedName}
                    className={cx("sr-only peer", classes.input)}
                    checked={!!isChecked}
                    onChange={handleOnChange}
                    disabled={isDisabled}
                    aria-checked={isIndeterminate ? "mixed" : undefined}
                />

                <span
                    className={cx(
                        "relative inline-flex items-center justify-center shrink-0 border transition-all",
                        "bg-[var(--refraktor-bg)] border-[var(--refraktor-border)]",
                        "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--refraktor-primary)]",
                        "data-[checked=true]:bg-[var(--refraktor-primary)] data-[checked=true]:border-[var(--refraktor-primary)]",
                        "data-[indeterminate=true]:bg-[var(--refraktor-primary)] data-[indeterminate=true]:border-[var(--refraktor-primary)]",
                        sizeClass.indicator,
                        getRadius(resolvedRadius),
                        classes.indicator
                    )}
                    data-checked={isChecked}
                    data-indeterminate={isIndeterminate}
                >
                    {(isChecked || isIndeterminate) && (
                        <span
                            className={cx(
                                "text-[var(--refraktor-primary-text)]",
                                sizeClass.icon,
                                classes.icon
                            )}
                        >
                            {isIndeterminate ? (
                                <MinusIcon size="100%" />
                            ) : (
                                <CheckIcon size="100%" />
                            )}
                        </span>
                    )}
                </span>

                {label && (
                    <span
                        className={cx(
                            "text-[var(--refraktor-text)]",
                            sizeClass.label,
                            classes.label
                        )}
                    >
                        {label}
                    </span>
                )}
            </label>

            {description && (
                <p
                    className={cx(
                        "text-[var(--refraktor-text-tertiary)] mt-1",
                        sizeClass.description,
                        classes.description
                    )}
                >
                    {description}
                </p>
            )}

            {error && error !== true && (
                <p
                    className={cx(
                        "text-[var(--refraktor-colors-red-5)] mt-1 text-xs",
                        classes.error
                    )}
                >
                    {error}
                </p>
            )}
        </div>
    );
});

Checkbox.displayName = "@refraktor/core/Checkbox";
Checkbox.configure = createComponentConfig<CheckboxProps>();
Checkbox.classNames = createClassNamesConfig<CheckboxClassNames>();
Checkbox.Group = CheckboxGroup;

export default Checkbox;
