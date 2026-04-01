const SHANGHAI = "Asia/Shanghai";

export function getDateKeyInShanghai(input: Date): string {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(input);
  return formatted;
}

export function getMonthKeyInShanghai(input: Date): string {
  return getDateKeyInShanghai(input).slice(0, 7);
}

export function resolveAnalyticsDateRange(
  now: Date,
  period: "day" | "week" | "month" | "year",
  dateFrom?: string,
  dateTo?: string
): { dateFrom: string; dateTo: string } {
  if (dateFrom && dateTo) {
    return { dateFrom, dateTo };
  }

  const today = getDateKeyInShanghai(now);
  if (period === "day") {
    return { dateFrom: today, dateTo: today };
  }

  if (period === "week") {
    const end = new Date(now.getTime());
    const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    return {
      dateFrom: getDateKeyInShanghai(start),
      dateTo: getDateKeyInShanghai(end)
    };
  }

  if (period === "month") {
    const month = getMonthKeyInShanghai(now);
    return { dateFrom: `${month}-01`, dateTo: today };
  }

  const year = getDateKeyInShanghai(now).slice(0, 4);
  return { dateFrom: `${year}-01-01`, dateTo: today };
}

export function clampPercentage(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  return Number(value.toFixed(2));
}

