import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import type { ConfigType } from "dayjs";
import { useCallback, useMemo } from "react";
import { DatesContextProvider } from "./context";
import type {
    DatesContextValue,
    DatesProviderProps,
    DayOfWeek,
    WeekdayFormat
} from "./types";

dayjs.extend(localeData);

const DEFAULT_FIRST_DAY_OF_WEEK: DayOfWeek = 1;
const DEFAULT_WEEKDAY_FORMAT: WeekdayFormat = "short";
const DEFAULT_CONSISTENT_WEEKS = true;
const DEFAULT_LOCALE = "en";

type DayjsWithLocales = typeof dayjs & {
    Ls?: Record<string, unknown>;
};

const normalizeLocale = (locale: string) => {
    const normalizedLocale = locale.trim().toLowerCase().replace(/_/g, "-");

    if (!normalizedLocale) {
        throw new Error(
            "[@refraktor/dates] Invalid locale. Provide a non-empty locale string."
        );
    }

    return normalizedLocale;
};

const assertLocaleIsRegistered = (locale: string) => {
    const locales = (dayjs as DayjsWithLocales).Ls ?? {};

    if (locales[locale]) return;

    throw new Error(
        `[@refraktor/dates] Locale "${locale}" is not registered in dayjs. Import it before rendering DatesProvider (example: import "dayjs/locale/${locale}").`
    );
};

const isDayOfWeek = (value: number): value is DayOfWeek =>
    Number.isInteger(value) && value >= 0 && value <= 6;

const normalizeFirstDayOfWeek = (value: number): DayOfWeek => {
    if (!isDayOfWeek(value)) {
        throw new Error(
            `[@refraktor/dates] Invalid firstDayOfWeek "${value}". Expected a number between 0 and 6.`
        );
    }

    return value;
};

const rotateWeekdays = (
    weekdays: readonly string[],
    firstDayOfWeek: DayOfWeek
) => [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];

const getWeekdaysByFormat = (
    locale: string,
    format: WeekdayFormat,
    firstDayOfWeek: DayOfWeek
) => {
    const localeData = dayjs().locale(locale).localeData();

    const weekdays =
        format === "long"
            ? localeData.weekdays()
            : format === "narrow"
              ? localeData.weekdaysMin()
              : localeData.weekdaysShort();

    return rotateWeekdays(weekdays, firstDayOfWeek);
};

export const DatesProvider = ({
    children,
    locale = DEFAULT_LOCALE,
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    weekdayFormat = DEFAULT_WEEKDAY_FORMAT,
    consistentWeeks = DEFAULT_CONSISTENT_WEEKS
}: DatesProviderProps) => {
    const normalizedLocale = normalizeLocale(locale);
    const normalizedFirstDayOfWeek = normalizeFirstDayOfWeek(firstDayOfWeek);

    assertLocaleIsRegistered(normalizedLocale);

    const createDate = useCallback(
        (value?: ConfigType) => dayjs(value).locale(normalizedLocale),
        [normalizedLocale]
    );

    const weekdays = useMemo(
        () =>
            getWeekdaysByFormat(
                normalizedLocale,
                weekdayFormat,
                normalizedFirstDayOfWeek
            ),
        [normalizedFirstDayOfWeek, normalizedLocale, weekdayFormat]
    );

    const contextValue = useMemo<DatesContextValue>(
        () => ({
            locale: normalizedLocale,
            firstDayOfWeek: normalizedFirstDayOfWeek,
            weekdayFormat,
            consistentWeeks,
            weekdays,
            createDate
        }),
        [
            normalizedLocale,
            normalizedFirstDayOfWeek,
            weekdayFormat,
            consistentWeeks,
            weekdays,
            createDate
        ]
    );

    return (
        <DatesContextProvider value={contextValue}>
            {children}
        </DatesContextProvider>
    );
};

DatesProvider.displayName = "@refraktor/dates/DatesProvider";

export default DatesProvider;
