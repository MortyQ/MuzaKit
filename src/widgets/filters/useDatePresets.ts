import { DateTime } from "luxon";
import { computed } from "vue";

/**
 * Composable for date range presets in UTC mode
 * Uses Luxon for consistent UTC date handling
 *
 * Works with VDatepicker in strict UTC mode (:timezone="'UTC'")
 * All dates are calculated as Universal Calendar Dates (UTC)
 */
export function useDatePresets() {
  /**
   * Get current UTC date at start of day
   * "Today" is always the current UTC day (e.g., 2025-12-11T00:00:00Z)
   */
  const getStartOfToday = (): DateTime => {
    return DateTime.utc().startOf("day");
  };

  /**
   * Get the start of the week (Sunday) for a given date
   * Luxon uses Monday by default (ISO), but we need Sunday
   */
  const getStartOfWeek = (date: DateTime): DateTime => {
    const dayOfWeek = date.weekday; // 1=Mon, 7=Sun
    if (dayOfWeek === 7) {
      return date.startOf("day");
    }
    return date.minus({ days: dayOfWeek }).startOf("day");
  };

  /**
   * Get the end of the week (Saturday) for a given date
   */
  const getEndOfWeek = (date: DateTime): DateTime => {
    const startOfWeek = getStartOfWeek(date);
    return startOfWeek.plus({ days: 6 }).endOf("day");
  };

  /**
   * Get default date range (last 3 months / 90 days)
   * Returns native Date objects for UTC-mode VueDatePicker
   */
  const getDefaultDateRange = (): [Date, Date] => {
    const today = getStartOfToday();
    const threeMonthsAgo = today.minus({ days: 90 });

    return [threeMonthsAgo.toJSDate(), today.toJSDate()];
  };

  /**
   * Computed preset dates for quick selection
   * All dates are calculated relative to UTC "Today"
   * Reduced to most popular and essential ranges
   */
  const presetDates = computed(() => {
    const today = getStartOfToday();

    return [
      // Last complete week (Sunday to Saturday)
      {
        label: "Last Week",
        value: [
          getStartOfWeek(today.minus({ weeks: 1 }))
            .toJSDate(),
          getEndOfWeek(today.minus({ weeks: 1 })).toJSDate(),
        ],
      },
      // Most popular short-term ranges
      {
        label: "Last 7 Days",
        value: [today.minus({ days: 7 }).toJSDate(), today.toJSDate()],
      },
      {
        label: "Last 30 Days",
        value: [today.minus({ days: 30 }).toJSDate(), today.toJSDate()],
      },
      {
        label: "Last 90 Days",
        value: [today.minus({ days: 90 }).toJSDate(), today.toJSDate()],
      },
      {
        label: "Last 180 Days",
        value: [today.minus({ days: 180 }).toJSDate(), today.toJSDate()],
      },
      {
        label: "Last 365 Days",
        value: [today.minus({ days: 365 }).toJSDate(), today.toJSDate()],
      },
      {
        label: "This Month",
        value: [today.startOf("month").toJSDate(), today.toJSDate()],
      },
      {
        label: "This Year",
        value: [today.startOf("year").toJSDate(), today.toJSDate()],
      },
      // Previous complete periods
      {
        label: "Last Month",
        value: [today.minus({ months: 1 }).startOf("month").toJSDate(), today.minus({ months: 1 }).endOf("month").toJSDate()],
      },

    ];
  });

  /**
   * Helper to convert Date to UTC DateTime
   */
  const toUTCDateTime = (date: Date): DateTime => {
    return DateTime.fromJSDate(date, { zone: "utc" });
  };

  /**
   * Helper to format date range for display (in UTC)
   */
  const formatDateRange = (start: Date, end: Date, format = "MMM dd, yyyy"): string => {
    const startDt = toUTCDateTime(start);
    const endDt = toUTCDateTime(end);
    return `${startDt.toFormat(format)} - ${endDt.toFormat(format)}`;
  };

  return {
    getDefaultDateRange,
    presetDates,
    toUTCDateTime,
    formatDateRange,
  };
}

