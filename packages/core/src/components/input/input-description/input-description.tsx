import { ComponentPropsWithoutRef } from "react";
import { factory, useProps, cx } from "../../../utils";

export interface InputDescriptionProps extends ComponentPropsWithoutRef<"p"> {
    /** Editing root class name */
    className?: string;
}

const InputDescription = factory<{
    props: InputDescriptionProps;
    ref: HTMLParagraphElement;
}>((_props, ref) => {
    const { className, children, ...props } = useProps(
        "InputDescription",
        null,
        _props
    );

    return (
        <p
            ref={ref}
            className={cx(
                "text-xs leading-relaxed",
                "text-[var(--refraktor-text-tertiary)]",
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
});

InputDescription.displayName = "@refraktor/core/InputDescription";

export default InputDescription;
