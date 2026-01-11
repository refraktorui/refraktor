import { useId as useReactId } from "react";

export function useId(propId?: any): string {
    const id = useReactId();
    return propId ?? id;
}
