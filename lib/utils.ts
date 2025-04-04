import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export const truncateHash = (hash: string | null | undefined) => {
  if (!hash) return "N/A";
  return hash?.substring(0, 10) + "..." + hash?.substring((hash?.length || 0) - 9);
};
