import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

/**
 * Combines multiple class values into a single string.
 *
 * @param {ClassValue[]} inputs - An array of class values to be combined.
 * @return {string} - The combined class values as a string.
 */

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
