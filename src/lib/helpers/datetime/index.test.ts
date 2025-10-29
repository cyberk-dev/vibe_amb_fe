import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  isValidDate,
  now,
  today,
  tomorrow,
  yesterday,
  addDaysToDate,
  subtractDaysFromDate,
  addMonthsToDate,
  addYearsToDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  isDateBefore,
  isDateAfter,
  isSameDayAs,
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  toISOString,
  fromISOString,
  getAge,
  isPast,
  isFuture,
  isToday,
} from "./index";

describe("datetime helpers", () => {
  // All tests run in UTC timezone (configured in vitest.setup.ts)
  const testDate = new Date("2024-03-15T14:30:00.000Z");
  const testDateISO = "2024-03-15T14:30:00.000Z";

  describe("formatDate", () => {
    it("should format Date object with default format", () => {
      expect(formatDate(testDate)).toBe("2024-03-15");
    });

    it("should format ISO string with default format", () => {
      expect(formatDate(testDateISO)).toBe("2024-03-15");
    });

    it("should format with custom format string", () => {
      expect(formatDate(testDate, "dd/MM/yyyy")).toBe("15/03/2024");
    });

    it("should return empty string for invalid date", () => {
      expect(formatDate("invalid-date")).toBe("");
    });

    it("should handle edge case with empty string", () => {
      expect(formatDate("")).toBe("");
    });
  });

  describe("formatTime", () => {
    it("should format Date object with default format", () => {
      expect(formatTime(testDate)).toBe("14:30");
    });

    it("should format ISO string with default format", () => {
      expect(formatTime(testDateISO)).toBe("14:30");
    });

    it("should format with custom format string", () => {
      expect(formatTime(testDate, "HH:mm:ss")).toBe("14:30:00");
    });

    it("should return empty string for invalid date", () => {
      expect(formatTime("invalid-date")).toBe("");
    });
  });

  describe("formatDateTime", () => {
    it("should format Date object with default format", () => {
      expect(formatDateTime(testDate)).toBe("2024-03-15 14:30");
    });

    it("should format ISO string with default format", () => {
      expect(formatDateTime(testDateISO)).toBe("2024-03-15 14:30");
    });

    it("should format with custom format string", () => {
      expect(formatDateTime(testDate, "yyyy/MM/dd HH:mm:ss")).toBe(
        "2024/03/15 14:30:00",
      );
    });

    it("should return empty string for invalid date", () => {
      expect(formatDateTime("invalid-date")).toBe("");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-03-15T16:30:00.000Z"));
    });

    it("should format relative time for Date object", () => {
      const result = formatRelativeTime(testDate);
      expect(result).toContain("ago");
    });

    it("should format relative time for ISO string", () => {
      const result = formatRelativeTime(testDateISO);
      expect(result).toContain("ago");
    });

    it("should return empty string for invalid date", () => {
      expect(formatRelativeTime("invalid-date")).toBe("");
    });

    vi.useRealTimers();
  });

  describe("isValidDate", () => {
    it("should return true for valid Date object", () => {
      expect(isValidDate(testDate)).toBe(true);
    });

    it("should return true for valid ISO string", () => {
      expect(isValidDate(testDateISO)).toBe(true);
    });

    it("should return false for invalid date string", () => {
      expect(isValidDate("invalid-date")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidDate("")).toBe(false);
    });

    it("should return false for invalid Date object", () => {
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });
  });

  describe("now", () => {
    it("should return current Date object", () => {
      const result = now();
      expect(result).toBeInstanceOf(Date);
      expect(isValidDate(result)).toBe(true);
    });
  });

  describe("today", () => {
    it("should return today at midnight", () => {
      const result = today();
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe("tomorrow", () => {
    it("should return tomorrow at midnight", () => {
      const result = tomorrow();
      const todayDate = today();
      expect(getDaysDifference(result, todayDate)).toBe(1);
    });
  });

  describe("yesterday", () => {
    it("should return yesterday at midnight", () => {
      const result = yesterday();
      const todayDate = today();
      expect(getDaysDifference(todayDate, result)).toBe(1);
    });
  });

  describe("addDaysToDate", () => {
    it("should add days to Date object", () => {
      const result = addDaysToDate(testDate, 5);
      expect(formatDate(result)).toBe("2024-03-20");
    });

    it("should add days to ISO string", () => {
      const result = addDaysToDate(testDateISO, 5);
      expect(formatDate(result)).toBe("2024-03-20");
    });

    it("should handle negative days", () => {
      const result = addDaysToDate(testDate, -5);
      expect(formatDate(result)).toBe("2024-03-10");
    });
  });

  describe("subtractDaysFromDate", () => {
    it("should subtract days from Date object", () => {
      const result = subtractDaysFromDate(testDate, 5);
      expect(formatDate(result)).toBe("2024-03-10");
    });

    it("should subtract days from ISO string", () => {
      const result = subtractDaysFromDate(testDateISO, 5);
      expect(formatDate(result)).toBe("2024-03-10");
    });
  });

  describe("addMonthsToDate", () => {
    it("should add months to Date object", () => {
      const result = addMonthsToDate(testDate, 2);
      expect(formatDate(result)).toBe("2024-05-15");
    });

    it("should add months to ISO string", () => {
      const result = addMonthsToDate(testDateISO, 2);
      expect(formatDate(result)).toBe("2024-05-15");
    });

    it("should handle year rollover", () => {
      const result = addMonthsToDate(testDate, 10);
      expect(formatDate(result)).toBe("2025-01-15");
    });
  });

  describe("addYearsToDate", () => {
    it("should add years to Date object", () => {
      const result = addYearsToDate(testDate, 2);
      expect(formatDate(result)).toBe("2026-03-15");
    });

    it("should add years to ISO string", () => {
      const result = addYearsToDate(testDateISO, 2);
      expect(formatDate(result)).toBe("2026-03-15");
    });
  });

  describe("getStartOfDay", () => {
    it("should return start of day for Date object", () => {
      const result = getStartOfDay(testDate);
      expect(formatDateTime(result)).toBe("2024-03-15 00:00");
    });

    it("should return start of day for ISO string", () => {
      const result = getStartOfDay(testDateISO);
      expect(formatDateTime(result)).toBe("2024-03-15 00:00");
    });
  });

  describe("getEndOfDay", () => {
    it("should return end of day for Date object", () => {
      const result = getEndOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });

    it("should return end of day for ISO string", () => {
      const result = getEndOfDay(testDateISO);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });
  });

  describe("getStartOfWeek", () => {
    it("should return start of week for Date object", () => {
      const result = getStartOfWeek(testDate);
      expect(result).toBeInstanceOf(Date);
      expect(result.getDay()).toBe(0); // Sunday
    });
  });

  describe("getEndOfWeek", () => {
    it("should return end of week for Date object", () => {
      const result = getEndOfWeek(testDate);
      expect(result).toBeInstanceOf(Date);
      expect(result.getDay()).toBe(6); // Saturday
    });
  });

  describe("getStartOfMonth", () => {
    it("should return start of month for Date object", () => {
      const result = getStartOfMonth(testDate);
      expect(formatDate(result)).toBe("2024-03-01");
    });
  });

  describe("getEndOfMonth", () => {
    it("should return end of month for Date object", () => {
      const result = getEndOfMonth(testDate);
      expect(formatDate(result)).toBe("2024-03-31");
    });
  });

  describe("getStartOfYear", () => {
    it("should return start of year for Date object", () => {
      const result = getStartOfYear(testDate);
      expect(formatDate(result)).toBe("2024-01-01");
    });
  });

  describe("getEndOfYear", () => {
    it("should return end of year for Date object", () => {
      const result = getEndOfYear(testDate);
      expect(formatDate(result)).toBe("2024-12-31");
    });
  });

  describe("isDateBefore", () => {
    const date1 = new Date("2024-03-10T00:00:00.000Z");
    const date2 = new Date("2024-03-20T00:00:00.000Z");

    it("should return true if first date is before second", () => {
      expect(isDateBefore(date1, date2)).toBe(true);
    });

    it("should return false if first date is after second", () => {
      expect(isDateBefore(date2, date1)).toBe(false);
    });

    it("should work with ISO strings", () => {
      expect(
        isDateBefore("2024-03-10T00:00:00.000Z", "2024-03-20T00:00:00.000Z"),
      ).toBe(true);
    });
  });

  describe("isDateAfter", () => {
    const date1 = new Date("2024-03-20T00:00:00.000Z");
    const date2 = new Date("2024-03-10T00:00:00.000Z");

    it("should return true if first date is after second", () => {
      expect(isDateAfter(date1, date2)).toBe(true);
    });

    it("should return false if first date is before second", () => {
      expect(isDateAfter(date2, date1)).toBe(false);
    });

    it("should work with ISO strings", () => {
      expect(
        isDateAfter("2024-03-20T00:00:00.000Z", "2024-03-10T00:00:00.000Z"),
      ).toBe(true);
    });
  });

  describe("isSameDayAs", () => {
    it("should return true for same day", () => {
      const date1 = new Date("2024-03-15T10:00:00.000Z");
      const date2 = new Date("2024-03-15T20:00:00.000Z");
      expect(isSameDayAs(date1, date2)).toBe(true);
    });

    it("should return false for different days", () => {
      const date1 = new Date("2024-03-15T00:00:00.000Z");
      const date2 = new Date("2024-03-16T00:00:00.000Z");
      expect(isSameDayAs(date1, date2)).toBe(false);
    });

    it("should work with ISO strings", () => {
      expect(
        isSameDayAs("2024-03-15T10:00:00.000Z", "2024-03-15T20:00:00.000Z"),
      ).toBe(true);
    });
  });

  describe("getDaysDifference", () => {
    it("should calculate days difference", () => {
      const date1 = new Date("2024-03-20T00:00:00.000Z");
      const date2 = new Date("2024-03-10T00:00:00.000Z");
      expect(getDaysDifference(date1, date2)).toBe(10);
    });

    it("should work with ISO strings", () => {
      expect(
        getDaysDifference(
          "2024-03-20T00:00:00.000Z",
          "2024-03-10T00:00:00.000Z",
        ),
      ).toBe(10);
    });
  });

  describe("getHoursDifference", () => {
    it("should calculate hours difference", () => {
      const date1 = new Date("2024-03-15T14:00:00.000Z");
      const date2 = new Date("2024-03-15T10:00:00.000Z");
      expect(getHoursDifference(date1, date2)).toBe(4);
    });

    it("should work with ISO strings", () => {
      expect(
        getHoursDifference(
          "2024-03-15T14:00:00.000Z",
          "2024-03-15T10:00:00.000Z",
        ),
      ).toBe(4);
    });
  });

  describe("getMinutesDifference", () => {
    it("should calculate minutes difference", () => {
      const date1 = new Date("2024-03-15T14:30:00.000Z");
      const date2 = new Date("2024-03-15T14:00:00.000Z");
      expect(getMinutesDifference(date1, date2)).toBe(30);
    });

    it("should work with ISO strings", () => {
      expect(
        getMinutesDifference(
          "2024-03-15T14:30:00.000Z",
          "2024-03-15T14:00:00.000Z",
        ),
      ).toBe(30);
    });
  });

  describe("toISOString", () => {
    it("should convert Date to ISO string", () => {
      const result = toISOString(testDate);
      expect(result).toBe(testDateISO);
    });
  });

  describe("fromISOString", () => {
    it("should parse ISO string to Date", () => {
      const result = fromISOString(testDateISO);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(testDateISO);
    });
  });

  describe("getAge", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-03-15T00:00:00.000Z"));
    });

    it("should calculate age from birth date", () => {
      const birthDate = new Date("1990-03-15T00:00:00.000Z");
      expect(getAge(birthDate)).toBe(34);
    });

    it("should calculate age before birthday this year", () => {
      const birthDate = new Date("1990-05-15T00:00:00.000Z");
      expect(getAge(birthDate)).toBe(33);
    });

    it("should work with ISO string", () => {
      expect(getAge("1990-03-15T00:00:00.000Z")).toBe(34);
    });

    vi.useRealTimers();
  });

  describe("isPast", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-03-15T12:00:00.000Z"));
    });

    it("should return true for past date", () => {
      const pastDate = new Date("2024-03-14T00:00:00.000Z");
      expect(isPast(pastDate)).toBe(true);
    });

    it("should return false for future date", () => {
      const futureDate = new Date("2024-03-16T00:00:00.000Z");
      expect(isPast(futureDate)).toBe(false);
    });

    it("should work with ISO string", () => {
      expect(isPast("2024-03-14T00:00:00.000Z")).toBe(true);
    });

    vi.useRealTimers();
  });

  describe("isFuture", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-03-15T12:00:00.000Z"));
    });

    it("should return true for future date", () => {
      const futureDate = new Date("2024-03-16T00:00:00.000Z");
      expect(isFuture(futureDate)).toBe(true);
    });

    it("should return false for past date", () => {
      const pastDate = new Date("2024-03-14T00:00:00.000Z");
      expect(isFuture(pastDate)).toBe(false);
    });

    it("should work with ISO string", () => {
      expect(isFuture("2024-03-16T00:00:00.000Z")).toBe(true);
    });

    vi.useRealTimers();
  });

  describe("isToday", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-03-15T12:00:00.000Z"));
    });

    it("should return true for today's date", () => {
      const todayDate = new Date("2024-03-15T14:00:00.000Z");
      expect(isToday(todayDate)).toBe(true);
    });

    it("should return false for different day", () => {
      const otherDate = new Date("2024-03-14T00:00:00.000Z");
      expect(isToday(otherDate)).toBe(false);
    });

    it("should work with ISO string", () => {
      expect(isToday("2024-03-15T14:00:00.000Z")).toBe(true);
    });

    vi.useRealTimers();
  });
});
