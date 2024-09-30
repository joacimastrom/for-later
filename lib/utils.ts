import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};
