import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
    /** The size of the icon @default `20` */
    size?: number | string;

    /** Gets applied to the icon */
    className?: string;
}
