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
    ProgressClassNames,
    ProgressFactoryPayload,
    ProgressProps
} from "./progress.types";
import { getSize } from "./progress.styles";

const defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    indeterminate: false,
    animated: true,
    size: "md",
    radius: "full"
} satisfies Partial<ProgressProps>;

const Progress = factory<ProgressFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        min,
        max,
        indeterminate,
        animated,
        size,
        radius,
        className,
        classNames,
        ...props
    } = useProps("Progress", defaultProps, _props);
    const classes = useClassNames("Progress", classNames);

    const _id = useId(id);
    const sizeStyles = getSize(size);

    const lowerBound = Math.min(min, max);
    const upperBound = Math.max(min, max);
    const clampedValue = clamp(value, lowerBound, upperBound);
    const percentage =
        upperBound === lowerBound
            ? 0
            : ((clampedValue - lowerBound) / (upperBound - lowerBound)) * 100;

    return (
        <div className={cx("w-full", classes.root, className)}>
            <div
                {...props}
                ref={ref}
                id={_id}
                role="progressbar"
                aria-valuemin={indeterminate ? undefined : lowerBound}
                aria-valuemax={indeterminate ? undefined : upperBound}
                aria-valuenow={indeterminate ? undefined : clampedValue}
                className={cx(
                    "relative w-full overflow-hidden bg-[var(--refraktor-bg)]",
                    sizeStyles.track,
                    getRadius(radius),
                    classes.track
                )}
            >
                <div
                    className={cx(
                        "h-full bg-[var(--refraktor-primary)]",
                        getRadius(radius),
                        indeterminate &&
                            "absolute inset-y-0 left-0 refraktor-progress-indeterminate",
                        animated && !indeterminate &&
                            "transition-[width] duration-300 ease-out",
                        classes.bar
                    )}
                    style={indeterminate ? undefined : { width: `${percentage}%` }}
                />
            </div>
        </div>
    );
});

Progress.displayName = "@refraktor/core/Progress";
Progress.configure = createComponentConfig<ProgressProps>();
Progress.classNames = createClassNamesConfig<ProgressClassNames>();

export default Progress;
