import { clamp, useId } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    ProgressCircleClassNames,
    ProgressCircleFactoryPayload,
    ProgressCircleProps
} from "./progress-circle.types";
import { defaultSize, defaultStroke } from "./progress-circle.styles";

const defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    indeterminate: false,
    animated: true,
    size: defaultSize,
    stroke: defaultStroke
} satisfies Partial<ProgressCircleProps>;

const ProgressCircle = factory<ProgressCircleFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        value,
        min,
        max,
        indeterminate,
        animated,
        size,
        stroke,
        className,
        classNames,
        ...props
    } = useProps("ProgressCircle", defaultProps, _props);
    const classes = useClassNames("ProgressCircle", classNames);

    const _id = useId(id);

    const diameter = size;
    const strokeWidth = stroke;
    const radius = Math.max(0, diameter / 2 - strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;

    const lowerBound = Math.min(min, max);
    const upperBound = Math.max(min, max);
    const clampedValue = clamp(value, lowerBound, upperBound);

    const percentage =
        upperBound === lowerBound
            ? 0
            : ((clampedValue - lowerBound) / (upperBound - lowerBound)) * 100;

    const strokeDashoffset =
        circumference - (percentage / 100) * circumference;

    return (
        <div
            {...props}
            ref={ref}
            id={_id}
            role="progressbar"
            aria-valuemin={indeterminate ? undefined : lowerBound}
            aria-valuemax={indeterminate ? undefined : upperBound}
            aria-valuenow={indeterminate ? undefined : clampedValue}
            className={cx(
                "inline-flex items-center justify-center",
                classes.root,
                className
            )}
        >
            <svg
                viewBox={`0 0 ${diameter} ${diameter}`}
                width={diameter}
                height={diameter}
                className={cx("block -rotate-90", classes.svg)}
            >
                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={cx("stroke-[var(--refraktor-bg)]", classes.track)}
                />

                <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={
                        indeterminate
                            ? `${circumference * 0.4} ${circumference}`
                            : circumference
                    }
                    strokeDashoffset={
                        indeterminate ? circumference * 0.15 : strokeDashoffset
                    }
                    className={cx(
                        "stroke-[var(--refraktor-primary)]",
                        indeterminate && "loader-spin",
                        animated && !indeterminate &&
                            "transition-[stroke-dashoffset] duration-300 ease-out",
                        classes.bar
                    )}
                />
            </svg>
        </div>
    );
});

ProgressCircle.displayName = "@refraktor/core/ProgressCircle";
ProgressCircle.configure = createComponentConfig<ProgressCircleProps>();
ProgressCircle.classNames = createClassNamesConfig<ProgressCircleClassNames>();

export default ProgressCircle;
