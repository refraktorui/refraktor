import { IconProps } from "./types";

const CheckIcon = ({ size = 20, className, ...props }: IconProps) => {
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
                d="M5 12.5L9.5 17L19 7.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default CheckIcon;
