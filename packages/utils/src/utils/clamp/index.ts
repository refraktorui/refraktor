export function clamp(
    value: number,
    min: number | undefined,
    max: number | undefined
): number {
    if (min === undefined && max === undefined) return value;

    if (min !== undefined && max === undefined) return Math.max(min, value);

    if (min === undefined && max !== undefined) return Math.min(max, value);

    return Math.min(Math.max(value, min!), max!);
}
