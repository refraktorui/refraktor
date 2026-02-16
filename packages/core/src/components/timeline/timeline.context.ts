import { createSafeContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    TimelineClassNames,
    TimelineLineVariant,
    TimelineOrientation
} from "./timeline.types";

export interface TimelineContextValue {
    orientation: TimelineOrientation;
    size: RefraktorSize;
    radius: RefraktorRadius;
    lineVariant: TimelineLineVariant;
    active: number;
    getStyles: (part: keyof TimelineClassNames) => string | undefined;
}

export const [TimelineProvider, useTimelineContext] =
    createSafeContext<TimelineContextValue>(
        "Timeline component was not found in tree. Make sure Timeline.Item is wrapped with Timeline."
    );
