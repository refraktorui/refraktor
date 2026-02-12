import { IconProps } from "./types";

const MinusIcon = ({ size = 20, className, ...props }: IconProps) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M6 12H18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default MinusIcon;
