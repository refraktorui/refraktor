import { ComponentPropsWithoutRef } from "react";
import { factory, useProps, cx } from "../../../utils";

export interface InputLabelProps extends ComponentPropsWithoutRef<"label"> {
    /** Show required asterisk */
    required?: boolean;

    /** Used for editing root class name */
    className?: string;
}

const InputLabel = factory<{
    props: InputLabelProps;
    ref: HTMLLabelElement;
}>((_props, ref) => {
    const { required, className, children, ...props } = useProps(
        "InputLabel",
        null,
        _props
    );

    return (
        <label
            ref={ref}
            className={cx(
                "inline-block text-xs font-medium mb-0.5",
                "text-[var(--refraktor-text)]",
                className
            )}
            {...props}
        >
            {children}
            {required && (
                <span
                    className="ml-1 text-[var(--refraktor-colors-red-5)]"
                    aria-hidden="true"
                >
                    *
                </span>
            )}
        </label>
    );
});

InputLabel.displayName = "@refraktor/core/InputLabel";

export default InputLabel;
