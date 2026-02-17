import { clamp, useId, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    NumberInputClassNames,
    NumberInputFactoryPayload,
    NumberInputProps
} from "./number-input.types";
import { useCallback, useMemo, useRef } from "react";
import { ChevronIcon } from "../../icons";
import { InputWrapper } from "../input/input-wrapper";
import { InputField } from "../input/input-field";
import { getControlSize } from "./number-input.styles";

const isInterim = (value: string) =>
    value === "" ||
    value === "." ||
    value === "-" ||
    value === "-." ||
    /^-?\d+\.?$/.test(value);

const toNumber = (value: string) => {
    const num = parseFloat(value);
    return Number.isNaN(num) ? undefined : num;
};

const formatValue = (num: number, precision?: number) => {
    if (typeof precision === "number") {
        const factor = Math.pow(10, precision);
        const rounded = Math.round(num * factor) / factor;
        return rounded.toFixed(precision);
    }
    return String(num);
};

function decimalsCount(num: number): number {
    const str = num.toString();
    const decimalIndex = str.indexOf(".");
    return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

function addWithPrecision(
    value: number,
    step: number,
    precision?: number
): number {
    const decimals =
        precision ?? Math.max(decimalsCount(value), decimalsCount(step));
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor + step * factor) / factor;
}

const defaultProps = {
    size: "md",
    variant: "default",
    radius: "default",
    controlsPosition: "right",
    step: 1,
    defaultValue: 0
} satisfies Partial<NumberInputProps>;

const NumberInput = factory<NumberInputFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        label,
        description,
        error,
        required,
        withAsterisk,
        value,
        defaultValue,
        size,
        onChange,
        min,
        max,
        step,
        precision,
        controlsPosition,
        disabled,
        className,
        classNames,
        ...props
    } = useProps("NumberInput", defaultProps, _props);
    const classes = useClassNames("NumberInput", classNames);
    const _id = useId(id);

    const [_value, setValue] = useUncontrolled({
        value,
        defaultValue,
        finalValue: "",
        onChange
    });
    const controlSizing = getControlSize(size);

    const valueRef = useRef(_value);
    valueRef.current = _value;
    const holdTimer = useRef<any>(null);
    const repeatTimer = useRef<any>(null);

    const changeValue = useCallback(
        (direction: "increment" | "decrement") => {
            if (disabled) return;

            const currentStr = String(valueRef.current ?? "");
            const current = toNumber(currentStr);
            const delta = direction === "increment" ? step : -step;

            let next =
                current === undefined
                    ? addWithPrecision(0, delta, precision)
                    : addWithPrecision(current, delta, precision);

            next = clamp(next, min, max);

            const formatted = formatValue(next, precision);
            setValue(formatted);
            onChange?.(next);
        },
        [disabled, step, min, max, precision, onChange, setValue]
    );

    const startHold = (direction: "increment" | "decrement") => {
        if (disabled) return;

        changeValue(direction);

        holdTimer.current = setInterval(() => {
            repeatTimer.current = setTimeout(() => {
                changeValue(direction);
            }, 100);
        }, 400);
    };

    const stopHold = () => {
        if (holdTimer.current) clearInterval(holdTimer.current);
        if (repeatTimer.current) clearTimeout(repeatTimer.current);
        holdTimer.current = null;
        repeatTimer.current = null;
    };

    const { canIncrement, canDecrement } = useMemo(() => {
        if (disabled) return { canIncrement: false, canDecrement: false };

        const current = toNumber(String(_value));
        if (current === undefined)
            return { canIncrement: true, canDecrement: true };

        const canIncrement = max === undefined ? true : current < max;
        const canDecrement = min === undefined ? true : current > min;

        return { canIncrement, canDecrement };
    }, [_value, min, max, disabled]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;

            const value = event.target.value;

            if (isInterim(value)) {
                setValue(value);
                return;
            }

            const num = toNumber(value);
            if (num === undefined) return;

            setValue(value);
        },
        [disabled, setValue]
    );

    const handleBlur = useCallback(() => {
        if (disabled) return;

        const value = String(_value ?? "");
        const num = toNumber(value);

        if (num === undefined) {
            if (min !== undefined) setValue(String(min));
            else setValue("");
            onChange?.("");
            return;
        }

        const clamped = clamp(num, min, max);
        const formatted = formatValue(clamped, precision);
        setValue(formatted);
        onChange?.(clamped);
    }, [disabled, _value, min, max, precision, setValue, onChange]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled) return;

            if (event.key === "ArrowUp") {
                event.preventDefault();
                changeValue("increment");
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                changeValue("decrement");
            }
        },
        [disabled, changeValue]
    );

    const handleWheel = useCallback(
        (e: React.WheelEvent<HTMLInputElement>) => {
            if (disabled) return;
            if (document.activeElement !== e.currentTarget) return;

            e.preventDefault();
            if (e.deltaY < 0) changeValue("increment");
            else if (e.deltaY > 0) changeValue("decrement");
        },
        [disabled, changeValue]
    );

    const controls = useMemo(() => {
        if (controlsPosition === "none") return null;

        return (
            <div
                className={cx(
                    "inline-flex h-full flex-col overflow-hidden border-[var(--refraktor-border)] text-[var(--refraktor-text)]",
                    controlsPosition === "left" ? "border-r" : "border-l",
                    classes.controls
                )}
            >
                <button
                    type="button"
                    disabled={!canIncrement}
                    aria-disabled={!canIncrement}
                    data-disabled={!canIncrement}
                    className={cx(
                        "m-0 flex flex-1 items-center justify-center border-0 bg-transparent p-0 leading-none transition-colors",
                        controlSizing.width,
                        !canIncrement
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-[var(--refraktor-bg-hover)]",
                        classes.increment
                    )}
                    tabIndex={-1}
                    onMouseDown={(e) => {
                        if (!canIncrement) return;
                        e.preventDefault();
                        startHold("increment");
                    }}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchEnd={stopHold}
                >
                    <ChevronIcon
                        direction="up"
                        size={controlSizing.iconSize}
                        className={cx("block", !canIncrement && "opacity-50")}
                    />
                </button>

                <button
                    type="button"
                    disabled={!canDecrement}
                    aria-disabled={!canDecrement}
                    data-disabled={!canDecrement}
                    className={cx(
                        "m-0 flex flex-1 items-center justify-center border-0 bg-transparent p-0 leading-none transition-colors",
                        controlSizing.width,
                        !canDecrement
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-[var(--refraktor-bg-hover)]",
                        classes.decrement
                    )}
                    tabIndex={-1}
                    onMouseDown={(e) => {
                        if (!canDecrement) return;
                        e.preventDefault();
                        startHold("decrement");
                    }}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchEnd={stopHold}
                >
                    <ChevronIcon
                        direction="down"
                        size={controlSizing.iconSize}
                        className={cx("block", !canDecrement && "opacity-50")}
                    />
                </button>
            </div>
        );
    }, [controlsPosition, canIncrement, canDecrement, classes, controlSizing]);

    const hasWrapper = label || description || error;

    const field = (
        <InputField
            ref={ref}
            id={_id}
            type="number"
            required={required}
            error={!!error}
            disabled={disabled}
            size={size}
            min={min}
            max={max}
            step={step}
            value={_value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            leftSection={controlsPosition === "left" ? controls : undefined}
            rightSection={controlsPosition === "right" ? controls : undefined}
            className={className}
            classNames={{
                root: cx(
                    "px-0 gap-0 items-stretch overflow-hidden",
                    controlsPosition === "none"
                        ? "px-2"
                        : controlsPosition === "left"
                          ? "pr-2"
                          : "pl-2",
                    classes.root
                ),
                leftSection: cx(
                    "h-full self-stretch",
                    controlsPosition === "left" && controlSizing.leftSpacing,
                    classes.leftSection
                ),
                rightSection: cx(
                    "h-full self-stretch",
                    controlsPosition === "right" && controlSizing.rightSpacing,
                    classes.rightSection
                ),
                ...(classes as any)
            }}
            aria-describedby={
                error
                    ? `${_id}-error`
                    : description
                      ? `${_id}-description`
                      : undefined
            }
            aria-disabled={disabled}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={Number(_value)}
            {...props}
        />
    );

    if (!hasWrapper) {
        return field;
    }

    return (
        <InputWrapper
            label={label}
            description={description}
            error={error}
            required={required}
            withAsterisk={withAsterisk}
            inputId={_id}
        >
            {field}
        </InputWrapper>
    );
});

NumberInput.displayName = "@refraktor/core/NumberInput";
NumberInput.configure = createComponentConfig<NumberInputProps>();
NumberInput.classNames = createClassNamesConfig<NumberInputClassNames>();

export default NumberInput;
