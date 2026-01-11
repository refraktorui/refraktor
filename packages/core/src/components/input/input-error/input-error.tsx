import { ComponentPropsWithoutRef } from "react";
import { factory, useProps, cx } from "../../../utils";

export interface InputErrorProps extends ComponentPropsWithoutRef<"p"> {
    /** Editing root class name */
    className?: string;
}

const InputError = factory<{
    props: InputErrorProps;
    ref: HTMLParagraphElement;
}>((_props, ref) => {
    const { className, children, ...props } = useProps(
        "InputError",
        null,
        _props
    );

    return (
        <p
            ref={ref}
            className={cx(
                "text-xs mt-0.5",
                "text-[var(--refraktor-colors-red-5)]",
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
});

InputError.displayName = "@refraktor/core/InputError";

export default InputError;
