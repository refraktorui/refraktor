import {
    clamp,
    getChangeValue,
    useId,
    useUncontrolled
} from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    SliderClassNames,
    SliderFactoryPayload,
    SliderProps
} from "./slider.types";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { getSize } from "./slider.styles";

const defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    size: "md",
    radius: "full",
    showLabelOnHover: false
} satisfies Partial<SliderProps>;

const MARK_RADIUS_PX = 4;

const Slider = factory<SliderFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        defaultValue,
        onChange,
        onChangeEnd,
        min,
        max,
        step,
        precision,
        size,
        radius,
        disabled,
        label,
        showLabelOnHover,
        marks,
        className,
        classNames,
        ...props
    } = useProps("Slider", defaultProps, _props);
    const classes = useClassNames("Slider", classNames);

    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: min,
        onChange
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const trackRectRef = useRef<DOMRect | null>(null);
    const rafRef = useRef<number | null>(null);
    const pendingPositionRef = useRef<number | null>(null);
    const lastEmittedValueRef = useRef(_value);

    const _id = useId(id);
    const sizeStyles = getSize(size);

    const getPositionFromValue = (val: number) => {
        return ((val - min!) / (max! - min!)) * 100;
    };

    const getValueFromPosition = useCallback(
        (position: number) => {
            return getChangeValue({
                value: position,
                min: min!,
                max: max!,
                step: step!,
                precision
            });
        },
        [min, max, step, precision]
    );

    const updateTrackRect = useCallback(() => {
        trackRectRef.current =
            trackRef.current?.getBoundingClientRect() ?? null;
    }, []);

    const getPositionFromClientX = useCallback((clientX: number) => {
        const rect = trackRectRef.current;
        if (!rect || rect.width === 0) return 0;

        const position = (clientX - rect.left) / rect.width;
        return clamp(position, 0, 1);
    }, []);

    const flushPendingChange = useCallback(() => {
        if (pendingPositionRef.current === null) return;

        const newValue = getValueFromPosition(pendingPositionRef.current);
        pendingPositionRef.current = null;

        if (newValue === lastEmittedValueRef.current) return;

        lastEmittedValueRef.current = newValue;
        handleChange(newValue);
    }, [getValueFromPosition, handleChange]);

    const queueChange = useCallback(
        (position: number) => {
            pendingPositionRef.current = position;

            if (rafRef.current !== null) return;

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                flushPendingChange();
            });
        },
        [flushPendingChange]
    );

    const handleMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (disabled) return;

            const clientX =
                "touches" in event ? event.touches[0]?.clientX : event.clientX;
            if (clientX === undefined) return;

            if ("touches" in event) {
                event.preventDefault();
            }

            const position = getPositionFromClientX(clientX);
            queueChange(position);
        },
        [disabled, getPositionFromClientX, queueChange]
    );

    const handleEnd = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        flushPendingChange();
        setIsDragging(false);
        onChangeEnd?.(lastEmittedValueRef.current);
        trackRectRef.current = null;

        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("scroll", updateTrackRect, true);
        window.removeEventListener("resize", updateTrackRect);
    }, [flushPendingChange, handleMove, onChangeEnd, updateTrackRect]);

    const handleStart = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (disabled) return;

            event.preventDefault();
            setIsDragging(true);

            updateTrackRect();

            const clientX =
                "touches" in event ? event.touches[0]?.clientX : event.clientX;
            if (clientX === undefined) return;

            const position = getPositionFromClientX(clientX);
            pendingPositionRef.current = position;
            flushPendingChange();

            document.addEventListener("mousemove", handleMove);
            document.addEventListener("mouseup", handleEnd);
            document.addEventListener("touchmove", handleMove, {
                passive: false
            });
            document.addEventListener("touchend", handleEnd);
            document.addEventListener("scroll", updateTrackRect, true);
            window.addEventListener("resize", updateTrackRect);
        },
        [
            disabled,
            flushPendingChange,
            getPositionFromClientX,
            handleMove,
            handleEnd,
            updateTrackRect
        ]
    );

    useEffect(() => {
        lastEmittedValueRef.current = _value;
    }, [_value]);

    const position = getPositionFromValue(_value);
    const showLabel =
        label !== undefined && (isDragging || (showLabelOnHover && isHovered));

    return (
        <div
            {...props}
            ref={ref}
            id={_id}
            className={cx(
                "relative w-full",
                disabled && "opacity-50 cursor-not-allowed",
                classes.root,
                className
            )}
        >
            <div
                ref={trackRef}
                className={cx(
                    "relative w-full bg-[var(--refraktor-bg)] cursor-pointer touch-none",
                    sizeStyles.track,
                    getRadius(radius),
                    disabled && "cursor-not-allowed",
                    classes.track
                )}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            >
                <div
                    className={cx(
                        "absolute h-full bg-[var(--refraktor-primary)]",
                        getRadius(radius),
                        classes.bar
                    )}
                    style={{ width: `${position}%` }}
                />

                {marks && marks.length > 0 && (
                    <div
                        className={cx("absolute inset-0", classes.markWrapper)}
                    >
                        {marks.map((mark, index) => {
                            const markPosition = getPositionFromValue(
                                mark.value
                            );
                            const isActive = mark.value <= _value;

                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                    style={{
                                        left: `clamp(${MARK_RADIUS_PX}px, ${markPosition}%, calc(100% - ${MARK_RADIUS_PX}px))`
                                    }}
                                >
                                    <div
                                        className={cx(
                                            "w-1 h-1 rounded-full",
                                            isActive
                                                ? "bg-[var(--refraktor-colors-white)]"
                                                : "bg-[var(--refraktor-text-tertiary)]",
                                            classes.mark
                                        )}
                                    />
                                    {mark.label && (
                                        <span
                                            className={cx(
                                                "absolute top-4 text-xs text-[var(--refraktor-text-secondary)] whitespace-nowrap",
                                                classes.markLabel
                                            )}
                                        >
                                            {mark.label}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div
                    role="slider"
                    tabIndex={disabled ? -1 : 0}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={_value}
                    aria-disabled={disabled}
                    className={cx(
                        "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
                        "bg-[var(--refraktor-colors-white)] shadow-md border border-[var(--refraktor-border)]",
                        "cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none",
                        sizeStyles.thumb,
                        getRadius(radius),
                        disabled && "cursor-not-allowed hover:scale-100",
                        classes.thumb
                    )}
                    style={{ left: `${position}%` }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {showLabel && (
                        <div
                            className={cx(
                                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                                "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] rounded",
                                "whitespace-nowrap pointer-events-none",
                                sizeStyles.label,
                                classes.label
                            )}
                        >
                            {typeof label === "function"
                                ? (label as (value: number) => ReactNode)(
                                      _value
                                  )
                                : (label ?? _value)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

Slider.displayName = "@refraktor/core/Slider";
Slider.configure = createComponentConfig<SliderProps>();
Slider.classNames = createClassNamesConfig<SliderClassNames>();

export default Slider;
