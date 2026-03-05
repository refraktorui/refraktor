import { useId } from "@refraktor/utils";
import {
    createClassNamesConfig,
    createComponentConfig,
    cx,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    InputClassNames,
    InputFactoryPayload,
    InputProps
} from "./input.types";
import { InputWrapper } from "./input-wrapper";
import { InputLabel } from "./input-label";
import { InputDescription } from "./input-description";
import { InputError } from "./input-error";
import { InputField } from "./input-field";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default"
} satisfies Partial<InputProps>;

const Input = factory<InputFactoryPayload>((_props, ref) => {
    const {
        id,
        label,
        description,
        error,
        required,
        withAsterisk,
        className,
        classNames,
        ...props
    } = useProps("Input", defaultProps, _props);
    const classes = useClassNames<InputClassNames>("Input", classNames);

    const _id = useId(id);

    const hasWrapper = label || description || error;

    if (!hasWrapper) {
        return (
            <InputField
                ref={ref}
                id={_id}
                required={required}
                error={!!error}
                className={cx(classes.field, className)}
                classNames={{
                    root: classes.root,
                    leftSection: classes.leftSection,
                    rightSection: classes.rightSection
                }}
                {...props}
            />
        );
    }

    return (
        <InputWrapper
            label={label}
            description={description}
            error={error}
            required={required}
            withAsterisk={withAsterisk}
            inputId={_id}
            className={classes.wrapper}
            labelClassName={classes.label}
            descriptionClassName={classes.description}
            errorClassName={classes.error}
        >
            <InputField
                ref={ref}
                id={_id}
                required={required}
                error={!!error}
                className={cx(classes.field, className)}
                classNames={{
                    root: classes.root,
                    leftSection: classes.leftSection,
                    rightSection: classes.rightSection
                }}
                aria-describedby={
                    error
                        ? `${_id}-error`
                        : description
                        ? `${_id}-description`
                        : undefined
                }
                {...props}
            />
        </InputWrapper>
    );
});

Input.displayName = "@refraktor/core/Input";
Input.configure = createComponentConfig<InputProps>();
Input.classNames = createClassNamesConfig<InputClassNames>();
Input.Wrapper = InputWrapper;
Input.Label = InputLabel;
Input.Description = InputDescription;
Input.Error = InputError;
Input.Field = InputField;

export default Input;
