import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a key (camelCase, snake_case, or kebab-case) into a readable Title Case label.
 * Example: contactResistance -> Contact Resistance
 */
export function formatLabel(key: string): string {
  // Add space before capital letters in camelCase
  const withSpaces = key.replace(/([A-Z])/g, ' $1');
  
  // Replace underscores and hyphens with spaces
  const normalized = withSpaces.replace(/[_-]/g, ' ');
  
  // Capitalize first letter of each word and trim
  return normalized
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

