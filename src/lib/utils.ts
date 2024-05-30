import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any) => ReturnType<T>>(
  cb: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      cb(...args);
      timeout = undefined; // Reset timeout after callback execution
    }, delay);
  };
}

/**
 * Calculate the discount percentage.
 * @param {number} originalPrice - The original price of the item.
 * @param {number} discountedPrice - The discounted price of the item.
 * @returns {number} - The discount percentage.
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;

  return Number(discountPercentage.toFixed(0));
}
