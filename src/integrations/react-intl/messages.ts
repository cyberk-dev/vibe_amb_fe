import English from "./locales/en.json";
import Vietnamese from "./locales/vi.json";

// Utility function to flatten nested objects for react-intl
function flattenMessages(
  nestedMessages: Record<string, any>,
  prefix = ""
): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

export const messages: Record<string, Record<string, string>> = {
  "en-US": flattenMessages(English),
  vi: flattenMessages(Vietnamese),
};

export type Locale = "en-US" | "vi";
export const initialLocale: Locale = "en-US";
