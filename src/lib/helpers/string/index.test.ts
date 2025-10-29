import { describe, it, expect } from "vitest";
import {
  capitalize,
  truncate,
  truncateMiddle,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  removeWhitespace,
  slugify,
  getInitials,
  maskString,
  reverse,
  wordCount,
  stripHtml,
  escapeHtml,
  normalizeErrorMessage,
  normalizeTxnError,
} from "./index";

describe("string helpers", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle already capitalized string", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("should handle single character", () => {
      expect(capitalize("a")).toBe("A");
    });

    it("should return empty string for empty input", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle string with numbers", () => {
      expect(capitalize("123abc")).toBe("123abc");
    });
  });

  describe("truncate", () => {
    it("should truncate long string", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("should not truncate if string is shorter", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
    });

    it("should use custom ellipsis", () => {
      expect(truncate("Hello World", 5, "---")).toBe("Hello---");
    });

    it("should handle empty string", () => {
      expect(truncate("", 5)).toBe("");
    });

    it("should handle exact length", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
    });
  });

  describe("truncateMiddle", () => {
    it("should truncate middle of string", () => {
      expect(truncateMiddle("0x1234567890abcdef", 4, 4)).toBe("0x12...cdef");
    });

    it("should not truncate short strings", () => {
      expect(truncateMiddle("0x1234", 4, 4)).toBe("0x1234");
    });

    it("should use custom ellipsis", () => {
      expect(truncateMiddle("0x1234567890abcdef", 4, 4, "---")).toBe(
        "0x12---cdef",
      );
    });

    it("should handle default parameters", () => {
      expect(truncateMiddle("0x1234567890abcdef")).toBe("0x12...cdef");
    });

    it("should handle empty string", () => {
      expect(truncateMiddle("")).toBe("");
    });
  });

  describe("camelCase", () => {
    it("should convert kebab-case to camelCase", () => {
      expect(camelCase("hello-world")).toBe("helloWorld");
    });

    it("should convert snake_case to camelCase", () => {
      expect(camelCase("hello_world")).toBe("helloWorld");
    });

    it("should convert space-separated to camelCase", () => {
      expect(camelCase("hello world")).toBe("helloWorld");
    });

    it("should convert PascalCase to camelCase", () => {
      expect(camelCase("HelloWorld")).toBe("helloWorld");
    });

    it("should handle multiple words", () => {
      expect(camelCase("hello-world-test")).toBe("helloWorldTest");
    });
  });

  describe("kebabCase", () => {
    it("should convert camelCase to kebab-case", () => {
      expect(kebabCase("helloWorld")).toBe("hello-world");
    });

    it("should convert PascalCase to kebab-case", () => {
      expect(kebabCase("HelloWorld")).toBe("hello-world");
    });

    it("should convert spaces to hyphens", () => {
      expect(kebabCase("hello world")).toBe("hello-world");
    });

    it("should convert underscores to hyphens", () => {
      expect(kebabCase("hello_world")).toBe("hello-world");
    });

    it("should handle already kebab-case", () => {
      expect(kebabCase("hello-world")).toBe("hello-world");
    });
  });

  describe("snakeCase", () => {
    it("should convert camelCase to snake_case", () => {
      expect(snakeCase("helloWorld")).toBe("hello_world");
    });

    it("should convert PascalCase to snake_case", () => {
      expect(snakeCase("HelloWorld")).toBe("hello_world");
    });

    it("should convert spaces to underscores", () => {
      expect(snakeCase("hello world")).toBe("hello_world");
    });

    it("should convert hyphens to underscores", () => {
      expect(snakeCase("hello-world")).toBe("hello_world");
    });

    it("should handle already snake_case", () => {
      expect(snakeCase("hello_world")).toBe("hello_world");
    });
  });

  describe("pascalCase", () => {
    it("should convert camelCase to PascalCase", () => {
      expect(pascalCase("helloWorld")).toBe("HelloWorld");
    });

    it("should convert kebab-case to PascalCase", () => {
      expect(pascalCase("hello-world")).toBe("HelloWorld");
    });

    it("should convert snake_case to PascalCase", () => {
      expect(pascalCase("hello_world")).toBe("HelloWorld");
    });

    it("should convert space-separated to PascalCase", () => {
      expect(pascalCase("hello world")).toBe("HelloWorld");
    });

    it("should handle already PascalCase", () => {
      expect(pascalCase("HelloWorld")).toBe("HelloWorld");
    });
  });

  describe("removeWhitespace", () => {
    it("should remove all whitespace", () => {
      expect(removeWhitespace("hello world")).toBe("helloworld");
    });

    it("should remove multiple spaces", () => {
      expect(removeWhitespace("hello   world")).toBe("helloworld");
    });

    it("should remove tabs and newlines", () => {
      expect(removeWhitespace("hello\t\nworld")).toBe("helloworld");
    });

    it("should handle string with no whitespace", () => {
      expect(removeWhitespace("helloworld")).toBe("helloworld");
    });
  });

  describe("slugify", () => {
    it("should create URL-friendly slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("should remove special characters", () => {
      expect(slugify("Hello @#$ World!")).toBe("hello-world");
    });

    it("should handle multiple spaces", () => {
      expect(slugify("Hello   World")).toBe("hello-world");
    });

    it("should remove leading/trailing hyphens", () => {
      expect(slugify("-Hello World-")).toBe("hello-world");
    });

    it("should normalize accented characters", () => {
      expect(slugify("Héllo Wörld")).toBe("hello-world");
    });

    it("should collapse multiple hyphens", () => {
      expect(slugify("Hello---World")).toBe("hello-world");
    });
  });

  describe("getInitials", () => {
    it("should get initials from full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("should handle single name", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("should limit to max initials", () => {
      expect(getInitials("John Michael Doe", 2)).toBe("JM");
    });

    it("should handle three names", () => {
      expect(getInitials("John Michael Doe", 3)).toBe("JMD");
    });

    it("should return empty string for empty input", () => {
      expect(getInitials("")).toBe("");
    });

    it("should handle extra spaces", () => {
      expect(getInitials("  John   Doe  ")).toBe("JD");
    });
  });

  describe("maskString", () => {
    it("should mask string showing last 4 characters", () => {
      expect(maskString("1234567890")).toBe("******7890");
    });

    it("should use custom visible characters", () => {
      expect(maskString("1234567890", 3)).toBe("*******890");
    });

    it("should use custom mask character", () => {
      expect(maskString("1234567890", 4, "#")).toBe("######7890");
    });

    it("should not mask if string is too short", () => {
      expect(maskString("1234", 4)).toBe("1234");
    });

    it("should handle empty string", () => {
      expect(maskString("")).toBe("");
    });
  });

  describe("reverse", () => {
    it("should reverse string", () => {
      expect(reverse("hello")).toBe("olleh");
    });

    it("should handle single character", () => {
      expect(reverse("a")).toBe("a");
    });

    it("should handle empty string", () => {
      expect(reverse("")).toBe("");
    });

    it("should handle palindrome", () => {
      expect(reverse("racecar")).toBe("racecar");
    });
  });

  describe("wordCount", () => {
    it("should count words in string", () => {
      expect(wordCount("Hello world")).toBe(2);
    });

    it("should handle multiple spaces", () => {
      expect(wordCount("Hello   world")).toBe(2);
    });

    it("should handle leading/trailing spaces", () => {
      expect(wordCount("  Hello world  ")).toBe(2);
    });

    it("should return 0 for empty string", () => {
      expect(wordCount("")).toBe(0);
    });

    it("should handle single word", () => {
      expect(wordCount("Hello")).toBe(1);
    });

    it("should handle only spaces", () => {
      expect(wordCount("   ")).toBe(0);
    });
  });

  describe("stripHtml", () => {
    it("should remove HTML tags", () => {
      expect(stripHtml("<p>Hello</p>")).toBe("Hello");
    });

    it("should remove multiple tags", () => {
      expect(stripHtml("<p><strong>Hello</strong> world</p>")).toBe(
        "Hello world",
      );
    });

    it("should handle self-closing tags", () => {
      expect(stripHtml("Hello<br/>world")).toBe("Helloworld");
    });

    it("should handle nested tags", () => {
      expect(stripHtml("<div><p>Hello</p></div>")).toBe("Hello");
    });

    it("should handle string without tags", () => {
      expect(stripHtml("Hello world")).toBe("Hello world");
    });
  });

  describe("escapeHtml", () => {
    it("should escape ampersand", () => {
      expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });

    it("should escape less than", () => {
      expect(escapeHtml("a < b")).toBe("a &lt; b");
    });

    it("should escape greater than", () => {
      expect(escapeHtml("a > b")).toBe("a &gt; b");
    });

    it("should escape double quotes", () => {
      expect(escapeHtml('Say "hello"')).toBe("Say &quot;hello&quot;");
    });

    it("should escape single quotes", () => {
      expect(escapeHtml("It's")).toBe("It&#x27;s");
    });

    it("should escape multiple characters", () => {
      expect(escapeHtml('<p class="test">Tom & Jerry</p>')).toBe(
        "&lt;p class=&quot;test&quot;&gt;Tom &amp; Jerry&lt;/p&gt;",
      );
    });

    it("should handle string without special characters", () => {
      expect(escapeHtml("Hello world")).toBe("Hello world");
    });
  });

  describe("normalizeErrorMessage", () => {
    it("should extract message from response", () => {
      const error = {
        response: {
          data: {
            message: "Error occurred",
          },
        },
      };
      expect(normalizeErrorMessage(error)).toBe("Error occurred");
    });

    it("should return error message if no response", () => {
      const error = {
        message: "Network error",
      };
      expect(normalizeErrorMessage(error)).toBe("Network error");
    });

    it("should handle error object with both", () => {
      const error = {
        message: "Generic error",
        response: {
          data: {
            message: "Specific error",
          },
        },
      };
      expect(normalizeErrorMessage(error)).toBe("Specific error");
    });
  });

  describe("normalizeTxnError", () => {
    it("should extract message from response", () => {
      const error = {
        response: {
          data: {
            message: "Transaction failed",
          },
        },
      };
      expect(normalizeTxnError(error)).toBe("Transaction failed");
    });

    it("should normalize insufficient balance error", () => {
      const error = {
        message: "Transaction exceeds the balance of the account",
      };
      expect(normalizeTxnError(error)).toBe("Insufficient balance");
    });

    it("should normalize user denied transaction", () => {
      const error = {
        message: "User denied transaction signature",
      };
      expect(normalizeTxnError(error)).toBe(
        "User denied transaction signature",
      );
    });

    it("should normalize partial user denied message", () => {
      const error = {
        message: "Error: User denied transaction",
      };
      expect(normalizeTxnError(error)).toBe(
        "User denied transaction signature",
      );
    });

    it("should return generic message for unknown errors", () => {
      const error = {
        message: "Unknown error",
      };
      expect(normalizeTxnError(error)).toBe("Unknown error");
    });
  });
});
