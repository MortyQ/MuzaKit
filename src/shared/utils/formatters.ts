/**
 * Format utilities for strings, numbers, and other data types
 */

import { isNil } from "@/shared/utils/guards";

/**
 * Truncate a string to a maximum length and add ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Format bytes to human-readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string with units
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 * @param filename - Name of the file
 * @returns File extension without dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

/**
 * Check if file is an image
 * @param filename - Name of the file
 * @returns True if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase();
  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
  ].includes(ext);
};

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  UAH: "₴",
  JPY: "¥",
  CNY: "¥",
};

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number | unknown,
  options: string | { code: string; decimals?: number } = "USD",
): string => {
  if (isNil(value)) return "";

  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  const code = typeof options === "string" ? options : options.code;
  const decimals = typeof options === "object" ? options.decimals : undefined;

  // Get symbol or use code
  const symbol = CURRENCY_SYMBOLS[code] || code;

  // Handle negative values
  const isNegative = numValue < 0;
  const absValue = Math.abs(numValue);

  // Format with decimals and thousand separators
  const formatted = absValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals ?? 2,
    maximumFractionDigits: decimals ?? 2,
  });

  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

export const formatBoolean = (
  value: unknown,
  options?: { trueText?: string; falseText?: string; colored?: boolean },
): { text: string; class?: string } => {
  const boolValue = Boolean(value);
  const trueText = options?.trueText ?? "Yes";
  const falseText = options?.falseText ?? "No";
  const colored = options?.colored ?? true;

  const text = boolValue ? trueText : falseText;

  // Return object with text and optional CSS class
  if (colored) {
    const colorClass = boolValue ? "text-positive" : "text-negative";
    return { text, class: colorClass };
  }

  return { text };
};

export const formatPercentage = (
  value: unknown,
  options?: boolean | { decimals?: number; multiplier?: boolean },
): string => {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  const decimals = typeof options === "object" ? options.decimals ?? 2 : 2;
  const multiplier = typeof options === "object" ? options.multiplier ?? false : false;

  // If multiplier is true, multiply by 100 (0.15 -> 15%)
  // If false, assume value is already in percentage (15 -> 15%)
  const percentValue = multiplier ? numValue * 100 : numValue;

  return `${percentValue.toFixed(decimals)}%`;
};

export const formatNumber = (
  value: unknown,
  options?: string | { type?: string; decimals?: number },
): string => {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  const type = typeof options === "string" ? options : options?.type ?? "default";
  const decimals = typeof options === "object" ? options.decimals : undefined;

  switch (type) {
    case "compact":
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
      }).format(numValue);

    case "percent":
      return `${(numValue * 100).toFixed(decimals ?? 2)}%`;

    case "decimal":
      return numValue.toFixed(decimals ?? 2);

    case "default":
    default:
      return decimals !== undefined
        ? numValue.toFixed(decimals)
        : numValue.toLocaleString("en-US");
  }
};

export const formatDate = (
  value: unknown,
  options?: string | { format?: string; locale?: string },
): string => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value as string | number);
  if (isNaN(date.getTime())) return String(value);

  const format = typeof options === "string" ? options : options?.format ?? "short";
  const locale = typeof options === "object" ? options.locale : "en-US";

  switch (format) {
    case "short":
      return date.toLocaleDateString(locale);

    case "long":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    case "time":
      return date.toLocaleTimeString(locale);

    case "datetime":
      return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale)}`;

    default:
      // Custom format string (basic support for common patterns)
      // You can extend this with a library like date-fns for more complex patterns
      return date.toLocaleDateString(locale);
  }
};

export const formatFileSize = (
  value: unknown,
  options?: boolean | { decimals?: number },
): string => {
  const numValue = Number(value);
  if (isNaN(numValue)) return String(value);

  const decimals = typeof options === "object" ? options.decimals ?? 2 : 2;

  if (numValue === 0) return "0 Bytes";

  const k = 1024;
  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];
  const i = Math.floor(Math.log(numValue) / Math.log(k));

  return `${parseFloat((numValue / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
