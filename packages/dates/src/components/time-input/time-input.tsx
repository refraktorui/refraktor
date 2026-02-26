import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    Input,
    useClassNames,
    useProps,
    useTheme
} from "@refraktor/core";
import {
    TimeInputClassNames,
    TimeInputFactoryPayload,
    TimeInputProps
} from "./time-input.types";

const defaultProps = {
    withSeconds: false,
    size: "md",
    radius: "default",
    variant: "default"
} satisfies Partial<TimeInputProps>;

const TimeInput = factory<TimeInputFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        withSeconds,
        className,
        classNames,
        ...inputProps
    } = useProps("TimeInput", defaultProps, _props);
    const classes = useClassNames("TimeInput", classNames);

    return (
        <Input
            ref={ref}
            type="time"
            step={withSeconds ? 1 : undefined}
            className={cx(classes.input, className)}
            {...inputProps}
        />
    );
});

TimeInput.displayName = "@refraktor/dates/TimeInput";
TimeInput.configure = createComponentConfig<TimeInputProps>();
TimeInput.classNames = createClassNamesConfig<TimeInputClassNames>();

export default TimeInput;
