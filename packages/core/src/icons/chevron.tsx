import { IconProps } from "./types";

type ChevronIconProps = IconProps & {
    direction?: "up" | "down" | "left" | "right";
};

const ChevronIcon = ({
    size = 20,
    direction = "up",
    className,
    ...props
}: ChevronIconProps) => {
    const rotation = {
        up: "rotate(0)",
        right: "rotate(90deg)",
        down: "rotate(180deg)",
        left: "rotate(-90deg)"
    }[direction];

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ transform: rotation }}
            {...props}
        >
            <g strokeWidth="0" />
            <g strokeLinecap="round" strokeLinejoin="round" />
            <g>
                <path
                    d="M6 15L12 9L18 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
};

export default ChevronIcon;
