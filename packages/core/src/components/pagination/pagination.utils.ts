import { clamp } from "@refraktor/utils";

export type PaginationRangeItem = number | "dots-left" | "dots-right";

export type PaginationRangeOptions = {
    total: number;
    page: number;
    siblings: number;
    boundaries: number;
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

export function buildPaginationRange(
    options: PaginationRangeOptions
): PaginationRangeItem[] {
    const total = toSafeInteger(options.total, 0, 0);

    if (total <= 0) {
        return [];
    }

    const page = clamp(toSafeInteger(options.page, 1, 1), 1, total);
    const siblings = toSafeInteger(options.siblings, 1, 0);
    const boundaries = Math.min(
        toSafeInteger(options.boundaries, 1, 0),
        Math.floor(total / 2)
    );

    const totalVisibleNumbers = boundaries * 2 + siblings * 2 + 3;

    if (totalVisibleNumbers >= total) {
        return range(1, total);
    }

    const leftSiblingIndex = Math.max(page - siblings, boundaries + 2);
    const rightSiblingIndex = Math.min(page + siblings, total - boundaries - 1);

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots = rightSiblingIndex < total - boundaries - 1;

    const leftBoundary = range(1, boundaries);
    const rightBoundary = range(total - boundaries + 1, total);

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemsCount = boundaries + siblings * 2 + 2;
        const leftRange = range(1, leftItemsCount);

        return [...leftRange, "dots-right", ...rightBoundary];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemsCount = boundaries + siblings * 2 + 2;
        const rightRange = range(total - rightItemsCount + 1, total);

        return [...leftBoundary, "dots-left", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex);

        return [
            ...leftBoundary,
            "dots-left",
            ...middleRange,
            "dots-right",
            ...rightBoundary
        ];
    }

    return range(1, total);
}
