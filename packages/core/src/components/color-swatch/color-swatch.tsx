import { useId } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    ColorSwatchClassNames,
    ColorSwatchFactoryPayload,
    ColorSwatchProps
} from "./color-swatch.types";
import { getSize } from "./color-swatch.styles";

const defaultProps = {
    color: "transparent",
    size: "md",
    radius: "default"
} satisfies Partial<ColorSwatchProps>;

const ColorSwatch = factory<ColorSwatchFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        color,
        size,
        radius,
        children,
        className,
        classNames,
        ...props
    } = useProps("ColorSwatch", defaultProps, _props);
    const classes = useClassNames("ColorSwatch", classNames);

    const _id = useId(id);

    return (
        <div
            ref={ref}
            id={_id}
            className={cx(
                "relative inline-flex items-center justify-center overflow-hidden shrink-0 border border-[var(--refraktor-border)]",
                getSize(size),
                getRadius(radius),
                classes.root,
                className
            )}
            {...props}
        >
            <span
                aria-hidden
                className={cx(
                    "absolute inset-0 refraktor-transparency-grid pointer-events-none",
                    classes.grid
                )}
            />

            <span
                aria-hidden
                className={cx("absolute inset-0 pointer-events-none", classes.color)}
                style={{ background: color }}
            />

            {children && (
                <span
                    className={cx(
                        "relative z-[1] inline-flex items-center justify-center",
                        classes.content
                    )}
                >
                    {children}
                </span>
            )}
        </div>
    );
});

ColorSwatch.displayName = "@refraktor/core/ColorSwatch";
ColorSwatch.configure = createComponentConfig<ColorSwatchProps>();
ColorSwatch.classNames = createClassNamesConfig<ColorSwatchClassNames>();

export default ColorSwatch;
