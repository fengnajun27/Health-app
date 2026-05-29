"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AvatarPicker } from "@/components/AvatarPicker";
import {
  defaultFollowUpDate,
  emptyMemberForm,
  hasFollowUp,
  type MemberFormValues,
} from "@/lib/members";
import type { FamilyMemberProfile } from "@/lib/types";

interface MemberFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  member?: FamilyMemberProfile;
  onClose: () => void;
  onSave: (values: MemberFormValues) => void;
  onDelete?: () => void;
}

export function MemberFormModal({
  open,
  mode,
  member,
  onClose,
  onSave,
  onDelete,
}: MemberFormModalProps) {
  const [form, setForm] = useState<MemberFormValues>(emptyMemberForm);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (mode === "edit" && member) {
      setForm({
        name: member.name,
        relation: member.relation,
        routineCheckupDue: member.routineCheckupDue,
        lastCheckup: member.lastCheckup ?? "",
        followUpDue: member.followUpDue ?? "",
        followUpLabel: member.followUpLabel ?? "",
        avatarColor: member.avatarColor,
        avatarImage: member.avatarImage,
      });
      setShowFollowUp(hasFollowUp(member));
    } else {
      setForm(emptyMemberForm());
      setShowFollowUp(false);
    }
  }, [open, mode, member]);

  const clearFollowUp = () => {
    setForm((prev) => ({
      ...prev,
      followUpDue: "",
      followUpLabel: "",
    }));
    setShowFollowUp(false);
  };

  const addFollowUp = () => {
    setForm((prev) => ({
      ...prev,
      followUpDue: prev.followUpDue || defaultFollowUpDate(),
      followUpLabel: prev.followUpLabel || "复查",
    }));
    setShowFollowUp(true);
  };

  if (!open) return null;

  const isSelf = member?.relation === "本人";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("请输入姓名");
      return;
    }
    if (!form.relation.trim()) {
      setError("请输入关系（如：母亲、父亲）");
      return;
    }
    if (!form.routineCheckupDue) {
      setError("请选择下次常规体检日期");
      return;
    }
    if (showFollowUp && !form.followUpDue) {
      setError("请选择复查截止日期，或点击「删除复查提醒」");
      return;
    }
    const payload = showFollowUp
      ? form
      : { ...form, followUpDue: "", followUpLabel: "" };
    onSave(payload);
    onClose();
  };

  const set = (key: keyof MemberFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === "add" ? "添加家庭成员" : "编辑成员信息"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">姓名</span>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="成员姓名"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">关系</span>
            <input
              value={form.relation}
              onChange={(e) => set("relation", e.target.value)}
              disabled={isSelf}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="如：母亲、父亲、伴侣"
            />
            {isSelf && (
              <p className="mt-1 text-xs text-slate-400">「本人」关系不可修改</p>
            )}
          </label>

          <AvatarPicker
            value={{
              name: form.name,
              avatarColor: form.avatarColor,
              avatarImage: form.avatarImage,
            }}
            onChange={(patch) =>
              setForm((prev) => ({ ...prev, ...patch }))
            }
          />

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              下次常规体检
            </span>
            <input
              type="date"
              value={form.routineCheckupDue}
              onChange={(e) => set("routineCheckupDue", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              上次体检（选填）
            </span>
            <input
              type="date"
              value={form.lastCheckup}
              onChange={(e) => set("lastCheckup", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
            />
          </label>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">复查提醒</p>
              {showFollowUp ? (
                <button
                  type="button"
                  onClick={clearFollowUp}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  删除复查提醒
                </button>
              ) : (
                <button
                  type="button"
                  onClick={addFollowUp}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  + 添加
                </button>
              )}
            </div>

            {showFollowUp ? (
              <>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-500">复查项目</span>
                  <input
                    value={form.followUpLabel}
                    onChange={(e) => set("followUpLabel", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                    placeholder="如：甲状腺复查、血压随访"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="text-xs text-slate-500">复查截止日期</span>
                  <input
                    type="date"
                    value={form.followUpDue}
                    onChange={(e) => set("followUpDue", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                  />
                </label>
              </>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                暂无复查提醒，点击「添加」可新建
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700"
          >
            保存
          </button>

          {mode === "edit" && onDelete && !isSelf && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`确定删除「${member?.name}」吗？`)) {
                  onDelete();
                  onClose();
                }
              }}
              className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              删除该成员
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
