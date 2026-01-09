import { useState } from "react";

export type UseUncontrolledProps<T> = {
    value?: T;
    defaultValue?: T;
    finalValue?: T;
    onChange?: (value: T, ...payload: any[]) => void;
};

export type UseUncontrolledReturn<T> = [
    T,
    (value: T, ...payload: any[]) => void,
    boolean
];

export function useUncontrolled<T>({
    value,
    defaultValue,
    finalValue,
    onChange = () => {}
}: UseUncontrolledProps<T>): UseUncontrolledReturn<T> {
    const [state, setState] = useState(
        defaultValue !== undefined ? defaultValue : finalValue
    );

    const handleChange = (val: T, ...payload: any[]) => {
        setState(val);
        onChange?.(val, ...payload);
    };

    if (value !== undefined) {
        return [value as T, onChange, true];
    }

    return [state as T, handleChange, false];
}
