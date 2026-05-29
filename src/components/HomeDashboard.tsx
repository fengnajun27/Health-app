"use client";

import { LogOut } from "lucide-react";
import { FamilyMembersSection } from "@/components/FamilyMembersSection";
import { ReminderList } from "@/components/ReminderList";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { buildReminders } from "@/lib/reminders";
import { clearSession } from "@/lib/storage";
import type { StoredUser } from "@/lib/types";

interface HomeDashboardProps {
  user: StoredUser;
  onLogout: () => void;
}

export function HomeDashboard({ user, onLogout }: HomeDashboardProps) {
  const { members, removeFollowUp } = useFamilyMembers();

  const handleRemoveFollowUp = (memberId: string) => {
    if (confirm("确定删除该复查提醒吗？")) {
      removeFollowUp(memberId);
    }
  };
  const reminders = buildReminders(members);

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="pb-6">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-5">
        <div>
          <p className="text-sm text-slate-500">你好，</p>
          <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
        >
          <LogOut className="h-4 w-4" />
          退出
        </button>
      </header>

      <div className="space-y-8 px-4 py-6">
        <section>
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            体检 / 复查提醒
          </h2>
          <p className="mb-3 text-sm text-slate-500">
            按截止日期排序，优先显示 60 天内到期的项目
          </p>
          <ReminderList
            reminders={reminders}
            onRemoveFollowUp={handleRemoveFollowUp}
          />
        </section>

        <FamilyMembersSection />
      </div>
    </div>
  );
}
