import type { ConfigType, Dayjs } from "dayjs";
import type { ReactNode } from "react";

export type WeekdayFormat = "narrow" | "short" | "long";
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CreateDate = (value?: ConfigType) => Dayjs;

export type DatesProviderProps = {
    /** Content wrapped by the dates provider. */
    children: ReactNode;

    /** Locale key imported by the user in dayjs. @default `en` */
    locale?: string;

    /** First day shown in week headers/grid. @default `1` (Monday) */
    firstDayOfWeek?: DayOfWeek;

    /** Weekday label style. @default `short` */
    weekdayFormat?: WeekdayFormat;

    /** Keep calendar grid at six rows. @default `true` */
    consistentWeeks?: boolean;
};

export type DatesContextValue = {
    locale: string;
    firstDayOfWeek: DayOfWeek;
    weekdayFormat: WeekdayFormat;
    consistentWeeks: boolean;
    weekdays: string[];
    createDate: CreateDate;
};
