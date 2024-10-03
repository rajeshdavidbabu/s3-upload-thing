import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["KB", "MB", "GB", "TB"];
  const accurateSizes = ["KiB", "MiB", "GiB", "TiB"];
  if (bytes < 1024) return "0 KB"; // Round up to 1 KB for small values
  const i = Math.floor(Math.log(bytes) / Math.log(1024)) - 1; // Subtract 1 to start from KB
  return `${(bytes / Math.pow(1024, i + 1)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "KiB")
      : (sizes[i] ?? "KB")
  }`;
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}
