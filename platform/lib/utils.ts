import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function for conditionally joining class names together
 * Combines clsx for conditional classes and tailwind-merge to handle Tailwind CSS class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

