import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const unitMap = {
  duration: "min",
  distance: "km",
} as const;

export function getUnit(metric: keyof typeof unitMap) {
  if (!(metric in unitMap)) {
    return "";
  }
  return unitMap[metric];
}

export function getTimeOfDay(
  isoString: string,
): "Morning" | "Afternoon" | "Evening" {
  const date = new Date(isoString);

  const hour = date.getHours(); // ローカルタイムで取得

  if (hour >= 5 && hour < 12) {
    return "Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Afternoon";
  }

  return "Evening";
}

export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "running":
      return "#D97706"; // amber-600
    case "cycling":
      return "#16A34A"; // green-600
    case "swimming":
      return "#2563EB"; // blue-600
    case "walking":
      return "#9333EA"; // purple-600
    case "gym":
      return "#DC2626 "; // orange-600
    case "yoga":
      return "#DB2777"; // pink-600
    case "hiking":
      return "#0891B2"; // cyan-600
    case "boxing":
      return "#000000"; // black
    default:
      return "#6B7280"; // gray-500 fallback
  }
}

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
