import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function cx(...classes: Parameters<typeof clsx>) {
    return twMerge(clsx(...classes));
}
