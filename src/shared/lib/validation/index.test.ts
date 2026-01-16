import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidUrl,
  isEmpty,
  isStrongPassword,
  isValidPhoneNumber,
  isValidCreditCard,
  isValidIPv4,
  isValidHexColor,
  isAlpha,
  isAlphanumeric,
  isNumeric,
  isValidJSON,
  isValidPostalCode,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isValidSlug,
} from "./index";

describe("validation helpers", () => {
  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@example.com")).toBe(true);
      expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test@example")).toBe(false);
      expect(isValidEmail("test example@test.com")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("https://example.com/path")).toBe(true);
      expect(isValidUrl("https://example.com:8080")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("invalid")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("//example.com")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidUrl("")).toBe(false);
    });

    it("should handle protocol-relative URLs", () => {
      expect(isValidUrl("ftp://example.com")).toBe(true);
    });
  });

  describe("isEmpty", () => {
    it("should return true for empty values", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return false for non-empty values", () => {
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty(" hello ")).toBe(false);
      expect(isEmpty("0")).toBe(false);
    });
  });

  describe("isStrongPassword", () => {
    it("should validate strong passwords", () => {
      expect(isStrongPassword("Password1")).toBe(true);
      expect(isStrongPassword("MyP@ssw0rd")).toBe(true);
      expect(isStrongPassword("Abcdefgh1")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(isStrongPassword("password")).toBe(false); // no uppercase or number
      expect(isStrongPassword("PASSWORD")).toBe(false); // no lowercase or number
      expect(isStrongPassword("12345678")).toBe(false); // no letters
      expect(isStrongPassword("Pass1")).toBe(false); // too short
      expect(isStrongPassword("password1")).toBe(false); // no uppercase
      expect(isStrongPassword("PASSWORD1")).toBe(false); // no lowercase
    });

    it("should return false for empty string", () => {
      expect(isStrongPassword("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isStrongPassword(null as any)).toBe(false);
      expect(isStrongPassword(undefined as any)).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhoneNumber("1234567890")).toBe(true);
      expect(isValidPhoneNumber("+1-234-567-8900")).toBe(true);
      expect(isValidPhoneNumber("(123) 456-7890")).toBe(true);
      expect(isValidPhoneNumber("+44 20 1234 5678")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhoneNumber("123")).toBe(false); // too short
      expect(isValidPhoneNumber("12345678901234567")).toBe(false); // too long
      expect(isValidPhoneNumber("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidPhoneNumber(null as any)).toBe(false);
      expect(isValidPhoneNumber(undefined as any)).toBe(false);
    });
  });

  describe("isValidCreditCard", () => {
    it("should validate valid credit card numbers", () => {
      expect(isValidCreditCard("4532015112830366")).toBe(true); // Visa
      expect(isValidCreditCard("5425233430109903")).toBe(true); // Mastercard
      expect(isValidCreditCard("374245455400126")).toBe(true); // Amex
    });

    it("should reject invalid credit card numbers", () => {
      expect(isValidCreditCard("1234567890123456")).toBe(false); // fails Luhn
      expect(isValidCreditCard("123")).toBe(false); // too short
      expect(isValidCreditCard("")).toBe(false);
    });

    it("should handle credit cards with spaces/hyphens", () => {
      expect(isValidCreditCard("4532-0151-1283-0366")).toBe(true);
      expect(isValidCreditCard("4532 0151 1283 0366")).toBe(true);
    });

    it("should return false for null/undefined", () => {
      expect(isValidCreditCard(null as any)).toBe(false);
      expect(isValidCreditCard(undefined as any)).toBe(false);
    });
  });

  describe("isValidIPv4", () => {
    it("should validate correct IPv4 addresses", () => {
      expect(isValidIPv4("192.168.1.1")).toBe(true);
      expect(isValidIPv4("0.0.0.0")).toBe(true);
      expect(isValidIPv4("255.255.255.255")).toBe(true);
      expect(isValidIPv4("127.0.0.1")).toBe(true);
    });

    it("should reject invalid IPv4 addresses", () => {
      expect(isValidIPv4("256.1.1.1")).toBe(false); // out of range
      expect(isValidIPv4("192.168.1")).toBe(false); // too few octets
      expect(isValidIPv4("192.168.1.1.1")).toBe(false); // too many octets
      expect(isValidIPv4("192.168.01.1")).toBe(false); // leading zero
      expect(isValidIPv4("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidIPv4(null as any)).toBe(false);
      expect(isValidIPv4(undefined as any)).toBe(false);
    });
  });

  describe("isValidHexColor", () => {
    it("should validate correct hex colors", () => {
      expect(isValidHexColor("#ffffff")).toBe(true);
      expect(isValidHexColor("#000000")).toBe(true);
      expect(isValidHexColor("#abc123")).toBe(true);
      expect(isValidHexColor("#ABC")).toBe(true);
      expect(isValidHexColor("#fff")).toBe(true);
    });

    it("should reject invalid hex colors", () => {
      expect(isValidHexColor("ffffff")).toBe(false); // missing #
      expect(isValidHexColor("#gg0000")).toBe(false); // invalid characters
      expect(isValidHexColor("#12345")).toBe(false); // wrong length
      expect(isValidHexColor("#1234567")).toBe(false); // too long
      expect(isValidHexColor("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidHexColor(null as any)).toBe(false);
      expect(isValidHexColor(undefined as any)).toBe(false);
    });
  });

  describe("isAlpha", () => {
    it("should validate alphabetic strings", () => {
      expect(isAlpha("hello")).toBe(true);
      expect(isAlpha("HELLO")).toBe(true);
      expect(isAlpha("HelloWorld")).toBe(true);
    });

    it("should reject non-alphabetic strings", () => {
      expect(isAlpha("hello123")).toBe(false);
      expect(isAlpha("hello world")).toBe(false);
      expect(isAlpha("hello-world")).toBe(false);
      expect(isAlpha("")).toBe(false);
    });
  });

  describe("isAlphanumeric", () => {
    it("should validate alphanumeric strings", () => {
      expect(isAlphanumeric("hello123")).toBe(true);
      expect(isAlphanumeric("HELLO123")).toBe(true);
      expect(isAlphanumeric("abc123XYZ")).toBe(true);
    });

    it("should reject non-alphanumeric strings", () => {
      expect(isAlphanumeric("hello world")).toBe(false);
      expect(isAlphanumeric("hello-123")).toBe(false);
      expect(isAlphanumeric("hello_123")).toBe(false);
      expect(isAlphanumeric("")).toBe(false);
    });
  });

  describe("isNumeric", () => {
    it("should validate numeric strings", () => {
      expect(isNumeric("123")).toBe(true);
      expect(isNumeric("0")).toBe(true);
      expect(isNumeric("999999")).toBe(true);
    });

    it("should reject non-numeric strings", () => {
      expect(isNumeric("123abc")).toBe(false);
      expect(isNumeric("12.34")).toBe(false);
      expect(isNumeric("-123")).toBe(false);
      expect(isNumeric("")).toBe(false);
    });
  });

  describe("isValidJSON", () => {
    it("should validate valid JSON strings", () => {
      expect(isValidJSON('{"key": "value"}')).toBe(true);
      expect(isValidJSON('["item1", "item2"]')).toBe(true);
      expect(isValidJSON('"string"')).toBe(true);
      expect(isValidJSON("123")).toBe(true);
      expect(isValidJSON("true")).toBe(true);
    });

    it("should reject invalid JSON strings", () => {
      expect(isValidJSON("{key: value}")).toBe(false);
      expect(isValidJSON("{'key': 'value'}")).toBe(false);
      expect(isValidJSON("{")).toBe(false);
      expect(isValidJSON("undefined")).toBe(false);
    });
  });

  describe("isValidPostalCode", () => {
    it("should validate US postal codes", () => {
      expect(isValidPostalCode("12345", "US")).toBe(true);
      expect(isValidPostalCode("12345-6789", "US")).toBe(true);
    });

    it("should validate Canadian postal codes", () => {
      expect(isValidPostalCode("A1B 2C3", "CA")).toBe(true);
      expect(isValidPostalCode("K1A 0B1", "CA")).toBe(true);
    });

    it("should validate UK postal codes", () => {
      expect(isValidPostalCode("SW1A 1AA", "UK")).toBe(true);
      expect(isValidPostalCode("M1 1AE", "UK")).toBe(true);
    });

    it("should validate German postal codes", () => {
      expect(isValidPostalCode("10115", "DE")).toBe(true);
      expect(isValidPostalCode("80331", "DE")).toBe(true);
    });

    it("should validate French postal codes", () => {
      expect(isValidPostalCode("75001", "FR")).toBe(true);
      expect(isValidPostalCode("13001", "FR")).toBe(true);
    });

    it("should reject invalid postal codes", () => {
      expect(isValidPostalCode("1234", "US")).toBe(false);
      expect(isValidPostalCode("123456", "US")).toBe(false);
      expect(isValidPostalCode("ABC123", "CA")).toBe(false);
      expect(isValidPostalCode("", "US")).toBe(false);
    });

    it("should return false for unsupported country", () => {
      expect(isValidPostalCode("12345", "XX")).toBe(false);
    });

    it("should default to US", () => {
      expect(isValidPostalCode("12345")).toBe(true);
    });
  });

  describe("hasMinLength", () => {
    it("should validate minimum length", () => {
      expect(hasMinLength("hello", 3)).toBe(true);
      expect(hasMinLength("hello", 5)).toBe(true);
    });

    it("should reject strings below minimum", () => {
      expect(hasMinLength("hi", 3)).toBe(false);
      expect(hasMinLength("", 1)).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(hasMinLength(null as any, 3)).toBe(false);
      expect(hasMinLength(undefined as any, 3)).toBe(false);
    });
  });

  describe("hasMaxLength", () => {
    it("should validate maximum length", () => {
      expect(hasMaxLength("hello", 10)).toBe(true);
      expect(hasMaxLength("hello", 5)).toBe(true);
    });

    it("should reject strings above maximum", () => {
      expect(hasMaxLength("hello world", 5)).toBe(false);
    });

    it("should return true for null/undefined", () => {
      expect(hasMaxLength(null as any, 3)).toBe(true);
      expect(hasMaxLength(undefined as any, 3)).toBe(true);
    });

    it("should return true for empty string", () => {
      expect(hasMaxLength("", 5)).toBe(true);
    });
  });

  describe("isInRange", () => {
    it("should validate numbers in range", () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange(0, 0, 10)).toBe(true);
      expect(isInRange(10, 0, 10)).toBe(true);
    });

    it("should reject numbers out of range", () => {
      expect(isInRange(-1, 0, 10)).toBe(false);
      expect(isInRange(11, 0, 10)).toBe(false);
    });

    it("should handle negative ranges", () => {
      expect(isInRange(-5, -10, 0)).toBe(true);
      expect(isInRange(-11, -10, 0)).toBe(false);
    });

    it("should handle decimal numbers", () => {
      expect(isInRange(5.5, 5, 6)).toBe(true);
      expect(isInRange(5.5, 6, 10)).toBe(false);
    });
  });

  describe("isValidSlug", () => {
    it("should validate correct slugs", () => {
      expect(isValidSlug("hello-world")).toBe(true);
      expect(isValidSlug("my-blog-post-123")).toBe(true);
      expect(isValidSlug("test")).toBe(true);
      expect(isValidSlug("a-b-c")).toBe(true);
    });

    it("should reject invalid slugs", () => {
      expect(isValidSlug("Hello-World")).toBe(false); // uppercase
      expect(isValidSlug("hello_world")).toBe(false); // underscore
      expect(isValidSlug("hello world")).toBe(false); // space
      expect(isValidSlug("hello--world")).toBe(false); // double hyphen
      expect(isValidSlug("-hello")).toBe(false); // leading hyphen
      expect(isValidSlug("hello-")).toBe(false); // trailing hyphen
      expect(isValidSlug("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidSlug(null as any)).toBe(false);
      expect(isValidSlug(undefined as any)).toBe(false);
    });
  });
});
