import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function statusColor(status: "normal" | "warning" | "abnormal"): string {
  switch (status) {
    case "normal":
      return "text-emerald-600 bg-emerald-50";
    case "warning":
      return "text-amber-600 bg-amber-50";
    case "abnormal":
      return "text-red-600 bg-red-50";
  }
}

export function riskBadge(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "bg-emerald-100 text-emerald-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "high":
      return "bg-red-100 text-red-700";
  }
}
