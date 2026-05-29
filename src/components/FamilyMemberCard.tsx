import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";
import type { FamilyMember } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FamilyMemberCard({ member }: { member: FamilyMember }) {
  return (
    <Link
      href={`/family/${member.id}`}
      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-200"
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white ${member.avatarColor}`}
      >
        {member.name.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900">{member.name}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {member.relation}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {member.recordCount} 份档案
          {member.lastCheckup &&
            ` · 最近体检 ${formatDate(member.lastCheckup)}`}
        </p>
        {member.alertCount > 0 && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {member.alertCount} 项待关注提醒
          </p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}
