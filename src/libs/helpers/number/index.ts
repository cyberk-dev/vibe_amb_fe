/**
 * Formats a number with commas and optional decimal places
 */
export function formatNumber(
  value: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a currency value
 */
export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a number with K, M, B suffixes
 */
export function formatCompact(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  if (Math.abs(value) < 1000) {
    return value.toString();
  }

  const tiers = [
    { threshold: 1e12, suffix: "T" },
    { threshold: 1e9, suffix: "B" },
    { threshold: 1e6, suffix: "M" },
    { threshold: 1e3, suffix: "K" },
  ];

  for (const { threshold, suffix } of tiers) {
    if (Math.abs(value) >= threshold) {
      return (value / threshold).toFixed(1).replace(/\.0$/, "") + suffix;
    }
  }

  return value.toString();
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Rounds a number to specified decimal places
 */
export function roundTo(value: number, decimals = 2): number {
  if (isNaN(value)) return 0;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converts bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Checks if a number is even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Checks if a number is odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Calculates the average of an array of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Finds the sum of an array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

/**
 * Converts a number to ordinal format (1st, 2nd, 3rd, etc.)
 */
export function toOrdinal(value: number): string {
  const j = value % 10;
  const k = value % 100;

  if (j === 1 && k !== 11) {
    return value + "st";
  }
  if (j === 2 && k !== 12) {
    return value + "nd";
  }
  if (j === 3 && k !== 13) {
    return value + "rd";
  }
  return value + "th";
}

/**
 * Checks if a value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Formats a file size in bytes to a readable format
 */
export function formatFileSize(bytes: number): string {
  return formatBytes(bytes, 1);
}
