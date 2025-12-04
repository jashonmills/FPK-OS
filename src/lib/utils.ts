import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determines if a given hex color is light or dark based on its perceived brightness.
 * @param {string} color - The hex color string (e.g., "#RRGGBB" or "#RGB").
 * @returns {'light' | 'dark'} - 'light' if the color is light, 'dark' otherwise.
 */
export function getLuminance(color: string): 'light' | 'dark' {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Handle 3-digit hex codes by expanding them
  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('')
    : hex;
  
  // Parse RGB values
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Formula for perceived brightness (Luma) - weights match human eye sensitivity
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Threshold at 0.5 - above is light, below is dark
  return luminance > 0.5 ? 'light' : 'dark';
}

/**
 * Returns appropriate text color class based on background color brightness.
 * @param {string} backgroundColor - The hex color string for the background.
 * @returns {string} - Tailwind class for text color ('text-white' or 'text-gray-900').
 */
export function getContrastTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  return luminance === 'dark' ? 'text-white' : 'text-gray-900';
}
