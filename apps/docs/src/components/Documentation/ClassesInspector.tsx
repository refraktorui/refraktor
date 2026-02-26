import { cx } from "@refraktor/core";
import { type ElementType, useEffect, useState } from "react";

export type SlotName = string;

export type ClassesInspectorProps = {
    Component: ElementType;
    slots: SlotName[];
    componentProps?: Record<string, unknown>;
};

export function ClassesInspector({
    Component,
    slots,
    componentProps = {}
}: ClassesInspectorProps) {
    const [highlight, setHighlight] = useState<SlotName | null>(null);
    const [isHoverable, setIsHoverable] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: hover)");
        const update = () => setIsHoverable(mq.matches);

        update();
        mq.addEventListener("change", update);

        return () => mq.removeEventListener("change", update);
    }, []);

    const computedClassNames = slots.reduce<Record<string, string>>(
        (acc, slot) => {
            acc[slot] = highlight === slot ? "ring ring-red-500" : "";
            return acc;
        },
        {}
    );

    return (
        <div className="flex flex-col lg:flex-row bg-dark-800 border border-dark-600 rounded-md overflow-hidden">
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8 min-h-32 border-b lg:border-b-0 lg:border-r border-dark-600">
                <Component
                    classNames={computedClassNames}
                    {...componentProps}
                />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex flex-col gap-1 p-2">
                    {slots.map((slot) => {
                        const active = highlight === slot;

                        return (
                            <button
                                key={slot}
                                onMouseEnter={() =>
                                    isHoverable && setHighlight(slot)
                                }
                                onMouseLeave={() =>
                                    isHoverable && setHighlight(null)
                                }
                                onClick={() =>
                                    !isHoverable &&
                                    setHighlight(active ? null : slot)
                                }
                                className={cx(
                                    "px-3 py-2 text-left rounded-md transition-all w-full select-none text-sm",
                                    "cursor-pointer hover:bg-dark-600 text-dark-100",
                                    active && "bg-dark-600 text-white"
                                )}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
