import type { FamilyMemberProfile, HealthReminder } from "./types";

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildReminders(members: FamilyMemberProfile[]): HealthReminder[] {
  const list: HealthReminder[] = [];

  for (const m of members) {
    list.push({
      id: `${m.id}-routine`,
      memberId: m.id,
      memberName: m.name,
      relation: m.relation,
      kind: "routine",
      title: "常规体检",
      dueDate: m.routineCheckupDue,
    });
    if (m.followUpDue) {
      list.push({
        id: `${m.id}-followup`,
        memberId: m.id,
        memberName: m.name,
        relation: m.relation,
        kind: "followup",
        title: m.followUpLabel ?? "复查",
        dueDate: m.followUpDue,
      });
    }
  }

  return list.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export function urgencyClass(days: number): string {
  if (days < 0) return "text-red-600 bg-red-50";
  if (days <= 7) return "text-amber-700 bg-amber-50";
  if (days <= 30) return "text-brand-700 bg-brand-50";
  return "text-slate-600 bg-slate-100";
}

export function urgencyLabel(days: number): string {
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天到期";
  if (days === 1) return "明天到期";
  return `还有 ${days} 天`;
}
