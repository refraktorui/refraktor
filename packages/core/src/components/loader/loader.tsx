import { CSSProperties, useMemo } from "react";
import { createComponentConfig, cx, factory, useProps } from "../../utils";
import { LoaderFactoryPayload, LoaderProps } from "./loader.types";
import { useId } from "@refraktor/utils";

const defaultProps = {
    size: 32,
    color: "var(--refraktor-primary)",
    speed: 1,
    stroke: 3,
    strokeLength: 0.6,
    bgOpacity: 0.1
} satisfies Partial<LoaderProps>;

const Loader = factory<LoaderFactoryPayload>((_props, ref) => {
    const {
        id,
        size,
        color,
        speed,
        stroke,
        strokeLength,
        bgOpacity,
        className,
        ...props
    } = useProps("Loader", defaultProps, _props);
    const _id = useId(id);

    const radius = Math.max(0, size / 2 - stroke / 2);
    const viewBoxSize = size;
    const viewBox = `0 0 ${viewBoxSize} ${viewBoxSize}`;

    const { dashArray } = useMemo(() => {
        const r = Math.max(0, size / 2 - stroke / 2);
        const c = 2 * Math.PI * r;
        return { circumference: c, dashArray: `${c * strokeLength} ${c}` };
    }, [size, stroke, strokeLength]);

    const commonStyle = {
        "--loader-speed": `${speed}s`
    } as CSSProperties;

    return (
        <div
            ref={ref}
            id={_id}
            className={cx("inline-flex items-center justify-center", className)}
            role="status"
            {...props}
        >
            <svg
                className="loader-spin"
                viewBox={viewBox}
                width={size}
                height={size}
                style={commonStyle}
            >
                <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={radius}
                    strokeWidth={stroke}
                    fill="none"
                    className="transition-colors duration-500 ease-in-out"
                    style={{
                        stroke: color,
                        opacity: bgOpacity
                    }}
                />
                <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={radius}
                    strokeWidth={stroke}
                    strokeDasharray={dashArray}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-colors duration-500 ease-in-out"
                    style={{ stroke: color }}
                />
            </svg>
        </div>
    );
});

Loader.displayName = "@refraktor/core/Loader";
Loader.configure = createComponentConfig<LoaderProps>();

export default Loader;
