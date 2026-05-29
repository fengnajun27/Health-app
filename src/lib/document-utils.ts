import type { HealthDocument } from "./types";

export function formatExamDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function groupDocumentsByDate(
  documents: HealthDocument[]
): { date: string; items: HealthDocument[] }[] {
  const map = new Map<string, HealthDocument[]>();
  for (const doc of documents) {
    const list = map.get(doc.examDate) ?? [];
    list.push(doc);
    map.set(doc.examDate, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([date, items]) => ({ date, items }));
}
