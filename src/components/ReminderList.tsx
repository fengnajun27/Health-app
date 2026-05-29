"use client";

import { AlertCircle, CalendarCheck, Trash2 } from "lucide-react";
import type { HealthReminder } from "@/lib/types";
import {
  daysUntil,
  formatDueDate,
  urgencyClass,
  urgencyLabel,
} from "@/lib/reminders";

interface ReminderListProps {
  reminders: HealthReminder[];
  onRemoveFollowUp?: (memberId: string) => void;
}

export function ReminderList({
  reminders,
  onRemoveFollowUp,
}: ReminderListProps) {
  const upcoming = reminders.filter((r) => daysUntil(r.dueDate) <= 60);

  if (upcoming.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        近 60 天内暂无到期提醒
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {upcoming.map((r) => {
        const days = daysUntil(r.dueDate);
        const Icon = r.kind === "routine" ? CalendarCheck : AlertCircle;
        const canDelete = r.kind === "followup" && onRemoveFollowUp;

        return (
          <li
            key={r.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                r.kind === "routine"
                  ? "bg-brand-50 text-brand-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">
                {r.memberName}
                <span className="font-normal text-slate-400">
                  {" "}
                  · {r.relation}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {r.title} · {formatDueDate(r.dueDate)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgencyClass(days)}`}
              >
                {urgencyLabel(days)}
              </span>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onRemoveFollowUp(r.memberId)}
                  className="flex items-center gap-0.5 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  删除
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
