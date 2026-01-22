type Props = {
    value: number;
    min: number;
    max: number;
    step: number;
    precision?: number;
};

export function getChangeValue({
    value,
    min,
    max,
    step,
    precision
}: Props): number {
    const scaled = min + value * (max - min);
    const stepped = Math.round(scaled / step) * step;

    if (precision !== undefined) return Number(stepped.toFixed(precision));

    return Math.min(Math.max(stepped, min), max);
}
