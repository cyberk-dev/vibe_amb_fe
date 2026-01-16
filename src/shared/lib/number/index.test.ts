import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCurrency,
  formatCompact,
  formatPercentage,
  roundTo,
  clamp,
  randomBetween,
  formatBytes,
  isEven,
  isOdd,
  average,
  sum,
  toOrdinal,
  isValidNumber,
  formatFileSize,
} from "./index";

describe("number helpers", () => {
  describe("formatNumber", () => {
    it("should format number with default settings", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
    });

    it("should format number with no decimals", () => {
      expect(formatNumber(1234.56, 0, 0)).toBe("1,235");
    });

    it("should format number with minimum fraction digits", () => {
      expect(formatNumber(1234, 2, 2)).toBe("1,234.00");
    });

    it("should format number with maximum fraction digits", () => {
      expect(formatNumber(1234.56789, 0, 2)).toBe("1,234.57");
    });

    it("should return empty string for null", () => {
      expect(formatNumber(null as any)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatNumber(undefined as any)).toBe("");
    });

    it("should return empty string for NaN", () => {
      expect(formatNumber(NaN)).toBe("");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-1234.56)).toBe("-1,234.56");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency with default USD", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format currency with EUR", () => {
      expect(formatCurrency(1234.56, "EUR", "en-US")).toBe("€1,234.56");
    });

    it("should format currency with GBP", () => {
      expect(formatCurrency(1234.56, "GBP", "en-US")).toBe("£1,234.56");
    });

    it("should return empty string for null", () => {
      expect(formatCurrency(null as any)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatCurrency(undefined as any)).toBe("");
    });

    it("should return empty string for NaN", () => {
      expect(formatCurrency(NaN)).toBe("");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should handle negative amounts", () => {
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });
  });

  describe("formatCompact", () => {
    it("should return number as string for values less than 1000", () => {
      expect(formatCompact(999)).toBe("999");
    });

    it("should format thousands with K suffix", () => {
      expect(formatCompact(1500)).toBe("1.5K");
    });

    it("should format millions with M suffix", () => {
      expect(formatCompact(1500000)).toBe("1.5M");
    });

    it("should format billions with B suffix", () => {
      expect(formatCompact(1500000000)).toBe("1.5B");
    });

    it("should format trillions with T suffix", () => {
      expect(formatCompact(1500000000000)).toBe("1.5T");
    });

    it("should remove trailing .0", () => {
      expect(formatCompact(1000)).toBe("1K");
    });

    it("should handle negative numbers", () => {
      expect(formatCompact(-1500)).toBe("-1.5K");
    });

    it("should return empty string for null", () => {
      expect(formatCompact(null as any)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatCompact(undefined as any)).toBe("");
    });

    it("should return empty string for NaN", () => {
      expect(formatCompact(NaN)).toBe("");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage with default decimals", () => {
      expect(formatPercentage(0.1234)).toBe("12.34%");
    });

    it("should format percentage with custom decimals", () => {
      expect(formatPercentage(0.1234, 1)).toBe("12.3%");
    });

    it("should format percentage with zero decimals", () => {
      expect(formatPercentage(0.1234, 0)).toBe("12%");
    });

    it("should handle 100%", () => {
      expect(formatPercentage(1)).toBe("100.00%");
    });

    it("should handle 0%", () => {
      expect(formatPercentage(0)).toBe("0.00%");
    });

    it("should return empty string for null", () => {
      expect(formatPercentage(null as any)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatPercentage(undefined as any)).toBe("");
    });

    it("should return empty string for NaN", () => {
      expect(formatPercentage(NaN)).toBe("");
    });
  });

  describe("roundTo", () => {
    it("should round to 2 decimals by default", () => {
      expect(roundTo(1.2345)).toBe(1.23);
    });

    it("should round to custom decimal places", () => {
      expect(roundTo(1.2345, 3)).toBe(1.235);
    });

    it("should round to zero decimals", () => {
      expect(roundTo(1.6, 0)).toBe(2);
    });

    it("should handle negative numbers", () => {
      expect(roundTo(-1.2345, 2)).toBe(-1.23);
    });

    it("should return 0 for NaN", () => {
      expect(roundTo(NaN)).toBe(0);
    });
  });

  describe("clamp", () => {
    it("should return value if within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it("should return min if value is below min", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it("should return max if value is above max", () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it("should handle negative ranges", () => {
      expect(clamp(-5, -10, 0)).toBe(-5);
    });

    it("should handle value equal to min", () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it("should handle value equal to max", () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe("randomBetween", () => {
    it("should return number within range", () => {
      const result = randomBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("should return min when min equals max", () => {
      expect(randomBetween(5, 5)).toBe(5);
    });

    it("should handle negative ranges", () => {
      const result = randomBetween(-10, -1);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-1);
    });

    it("should return integer", () => {
      const result = randomBetween(1, 10);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("formatBytes", () => {
    it("should format 0 bytes", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
    });

    it("should format bytes", () => {
      expect(formatBytes(500)).toBe("500 Bytes");
    });

    it("should format kilobytes", () => {
      expect(formatBytes(1024)).toBe("1 KB");
    });

    it("should format megabytes", () => {
      expect(formatBytes(1048576)).toBe("1 MB");
    });

    it("should format gigabytes", () => {
      expect(formatBytes(1073741824)).toBe("1 GB");
    });

    it("should format terabytes", () => {
      expect(formatBytes(1099511627776)).toBe("1 TB");
    });

    it("should format petabytes", () => {
      expect(formatBytes(1125899906842624)).toBe("1 PB");
    });

    it("should handle custom decimals", () => {
      expect(formatBytes(1536, 1)).toBe("1.5 KB");
    });

    it("should handle decimal precision", () => {
      expect(formatBytes(1500, 0)).toBe("1 KB");
    });
  });

  describe("isEven", () => {
    it("should return true for even numbers", () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-4)).toBe(true);
    });

    it("should return false for odd numbers", () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(-5)).toBe(false);
    });
  });

  describe("isOdd", () => {
    it("should return true for odd numbers", () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(-5)).toBe(true);
    });

    it("should return false for even numbers", () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(0)).toBe(false);
      expect(isOdd(-4)).toBe(false);
    });
  });

  describe("average", () => {
    it("should calculate average of numbers", () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it("should handle single number", () => {
      expect(average([5])).toBe(5);
    });

    it("should return 0 for empty array", () => {
      expect(average([])).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(average([-2, -4, -6])).toBe(-4);
    });

    it("should handle decimals", () => {
      expect(average([1.5, 2.5, 3.5])).toBe(2.5);
    });
  });

  describe("sum", () => {
    it("should calculate sum of numbers", () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it("should handle single number", () => {
      expect(sum([5])).toBe(5);
    });

    it("should return 0 for empty array", () => {
      expect(sum([])).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(sum([-2, -4, -6])).toBe(-12);
    });

    it("should handle mixed positive and negative", () => {
      expect(sum([10, -5, 3, -2])).toBe(6);
    });
  });

  describe("toOrdinal", () => {
    it("should convert 1 to 1st", () => {
      expect(toOrdinal(1)).toBe("1st");
    });

    it("should convert 2 to 2nd", () => {
      expect(toOrdinal(2)).toBe("2nd");
    });

    it("should convert 3 to 3rd", () => {
      expect(toOrdinal(3)).toBe("3rd");
    });

    it("should convert 4 to 4th", () => {
      expect(toOrdinal(4)).toBe("4th");
    });

    it("should handle teen numbers correctly", () => {
      expect(toOrdinal(11)).toBe("11th");
      expect(toOrdinal(12)).toBe("12th");
      expect(toOrdinal(13)).toBe("13th");
    });

    it("should handle 21st", () => {
      expect(toOrdinal(21)).toBe("21st");
    });

    it("should handle 22nd", () => {
      expect(toOrdinal(22)).toBe("22nd");
    });

    it("should handle 23rd", () => {
      expect(toOrdinal(23)).toBe("23rd");
    });

    it("should handle 100th", () => {
      expect(toOrdinal(100)).toBe("100th");
    });

    it("should handle 101st", () => {
      expect(toOrdinal(101)).toBe("101st");
    });
  });

  describe("isValidNumber", () => {
    it("should return true for valid numbers", () => {
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-123)).toBe(true);
      expect(isValidNumber(1.23)).toBe(true);
    });

    it("should return false for NaN", () => {
      expect(isValidNumber(NaN)).toBe(false);
    });

    it("should return false for Infinity", () => {
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(isValidNumber("123")).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber({})).toBe(false);
      expect(isValidNumber([])).toBe(false);
    });
  });

  describe("formatFileSize", () => {
    it("should format file size with 1 decimal", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });

    it("should handle 0 bytes", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
    });

    it("should format larger file sizes", () => {
      expect(formatFileSize(5242880)).toBe("5 MB");
    });
  });
});
