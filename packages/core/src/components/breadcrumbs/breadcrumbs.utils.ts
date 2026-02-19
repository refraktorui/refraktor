export type BreadcrumbsRangeItem = number | "collapse";

export type BreadcrumbsRangeOptions = {
    total: number;
    maxItems: number;
    itemsBeforeCollapse: number;
    itemsAfterCollapse: number;
    expanded: boolean;
};

function range(start: number, end: number) {
    if (end < start) {
        return [];
    }

    const length = end - start + 1;

    return Array.from({ length }, (_, index) => start + index);
}

function toSafeInteger(value: number, fallback: number, minimum = 0) {
    if (!Number.isFinite(value)) {
        return fallback;
    }

    return Math.max(minimum, Math.trunc(value));
}

export function buildBreadcrumbsRange(
    options: BreadcrumbsRangeOptions
): BreadcrumbsRangeItem[] {
    const total = toSafeInteger(options.total, 0, 0);

    if (total <= 0) {
        return [];
    }

    const all = range(0, total - 1);

    if (options.expanded) {
        return all;
    }

    const maxItems = toSafeInteger(options.maxItems, 0, 0);

    if (maxItems === 0 || total <= maxItems) {
        return all;
    }

    const itemsBeforeCollapse = Math.min(
        toSafeInteger(options.itemsBeforeCollapse, 1, 1),
        total - 1
    );
    const itemsAfterCollapse = Math.min(
        toSafeInteger(options.itemsAfterCollapse, 1, 1),
        total - itemsBeforeCollapse
    );

    const hiddenItems =
        total - itemsBeforeCollapse - Math.max(itemsAfterCollapse, 1);

    if (hiddenItems <= 1) {
        return all;
    }

    const start = range(0, itemsBeforeCollapse - 1);
    const end = range(total - itemsAfterCollapse, total - 1);

    return [...start, "collapse", ...end];
}
