"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Stethoscope, Trash2 } from "lucide-react";
import { MemberAvatar } from "@/components/MemberAvatar";
import type { FamilyMemberProfile } from "@/lib/types";
import {
  daysUntil,
  formatDueDate,
  urgencyClass,
  urgencyLabel,
} from "@/lib/reminders";

interface MemberBlockProps {
  member: FamilyMemberProfile;
  onRemoveFollowUp?: (memberId: string) => void;
}

export function MemberBlock({ member, onRemoveFollowUp }: MemberBlockProps) {
  const routineDays = daysUntil(member.routineCheckupDue);
  const followDays = member.followUpDue
    ? daysUntil(member.followUpDue)
    : null;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <Link
        href={`/member/${member.id}`}
        className="mb-4 flex items-center justify-between rounded-xl bg-brand-50/80 px-3 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
      >
        <span>查看体检档案 · 上传 PDF / 拍照</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
      <div className="flex items-center gap-4">
        <MemberAvatar member={member} size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
          <span className="mt-0.5 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {member.relation}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        <li className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">下次常规体检</p>
            <p className="mt-0.5 text-sm text-slate-600">
              {formatDueDate(member.routineCheckupDue)}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${urgencyClass(routineDays)}`}
            >
              {urgencyLabel(routineDays)}
            </span>
          </div>
        </li>

        {member.followUpDue && (
          <li className="flex items-start gap-3 rounded-xl bg-amber-50/80 px-4 py-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  {member.followUpLabel ?? "复查"} DDL
                </p>
                {onRemoveFollowUp && (
                  <button
                    type="button"
                    onClick={() => onRemoveFollowUp(member.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    title="删除复查提醒"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">
                {formatDueDate(member.followUpDue)}
              </p>
              {followDays !== null && (
                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${urgencyClass(followDays)}`}
                >
                  {urgencyLabel(followDays)}
                </span>
              )}
            </div>
          </li>
        )}
      </ul>

      {member.lastCheckup && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
          上次体检：{formatDueDate(member.lastCheckup)}
        </p>
      )}
    </section>
  );
}
