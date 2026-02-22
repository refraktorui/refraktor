import { Key, ReactNode } from "react";

/**
 * Supported collections for the For component. Accepts arrays, array-likes and iterables.
 */
export type ForList<T> = readonly T[] | Iterable<T> | ArrayLike<T>;

/**
 * Metadata passed to the render function for each item in the collection.
 */
export type ForRenderMeta<T> = {
    /** Index of the current item in the collection. */
    index: number;

    /** Total number of items in the collection. */
    length: number;

    /** Indicates whether the current item is the first in the collection. */
    isFirst: boolean;

    /** Indicates whether the current item is the last in the collection. */
    isLast: boolean;

    /** Previous item in the collection if it exists. */
    previous?: T;

    /** Next item in the collection if it exists. */
    next?: T;
};

export type ForProps<T> = {
    /** Collection that should be iterated. */
    each?: ForList<T> | null;
    /** Render function that receives the current item and helpful metadata. */
    children: (item: T, meta: ForRenderMeta<T>) => ReactNode;
    /** Node rendered when the collection is empty. */
    fallback?: ReactNode;
    /** Optional function to derive a stable React key for each item. */
    keyExtractor?: (item: T, index: number) => Key;
};
