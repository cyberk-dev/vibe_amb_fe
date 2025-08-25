/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 */
export function truncate(
  str: string,
  length: number,
  ellipsis = "..."
): string {
  if (!str) return str;
  if (str.length <= length) return str;
  return str.slice(0, length) + ellipsis;
}

/**
 * Truncates the middle part of a string (useful for addresses)
 */
export function truncateMiddle(
  str: string,
  startChars = 4,
  endChars = 4,
  ellipsis = "..."
): string {
  if (!str) return str;
  if (str.length <= startChars + endChars) return str;

  return `${str.slice(0, startChars)}${ellipsis}${str.slice(str.length - endChars)}`;
}

/**
 * Converts a string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Converts a string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Converts a string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Converts a string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Removes all whitespace from a string
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s/g, "");
}

/**
 * Slugifies a string (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extracts initials from a full name
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);
  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Masks a string with asterisks (useful for sensitive data)
 */
export function maskString(
  str: string,
  visibleChars = 4,
  maskChar = "*"
): string {
  if (!str) return str;
  if (str.length <= visibleChars) return str;

  const visible = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return masked + visible;
}

/**
 * Reverses a string
 */
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

/**
 * Counts words in a string
 */
export function wordCount(str: string): number {
  if (!str) return 0;
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Removes HTML tags from a string
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };

  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

export const normalizeErrorMessage = (error: any) => {
  if (error.response) {
    return error.response.data.message;
  }
  return error.message;
};

export const normalizeTxnError = (error: any) => {
  if (error.response) {
    return error.response.data.message;
  }
  if (error.message.includes("exceeds the balance of")) {
    return "Insufficient balance";
  }
  if (error.message.includes("User denied transaction")) {
    return "User denied transaction signature";
  }
  return error.message;
};
