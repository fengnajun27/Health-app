"use client";

import { useState } from "react";
import { Pencil, UserPlus } from "lucide-react";
import { MemberBlock } from "@/components/MemberBlock";
import { MemberFormModal } from "@/components/MemberFormModal";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { getStoredUser, saveUser } from "@/lib/storage";
import type { MemberFormValues } from "@/lib/members";
import type { FamilyMemberProfile } from "@/lib/types";

export function FamilyMembersSection() {
  const { members, addMember, updateMember, deleteMember, removeFollowUp } =
    useFamilyMembers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyMemberProfile | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (member: FamilyMemberProfile) => {
    setEditing(member);
    setModalOpen(true);
  };

  const syncSelfName = (name: string) => {
    const user = getStoredUser();
    if (user && user.name !== name) {
      saveUser({ name, phone: user.phone });
    }
  };

  const handleSave = (values: MemberFormValues) => {
    if (editing) {
      updateMember(editing.id, values);
      if (editing.relation === "本人") {
        syncSelfName(values.name);
      }
    } else {
      addMember(values);
    }
  };

  const handleDelete = () => {
    if (editing) deleteMember(editing.id);
  };

  const handleRemoveFollowUp = (memberId: string) => {
    if (confirm("确定删除该复查提醒吗？")) {
      removeFollowUp(memberId);
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">家庭成员</h2>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
        >
          <UserPlus className="h-4 w-4" />
          添加
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="relative">
            <MemberBlock
              member={member}
              onRemoveFollowUp={handleRemoveFollowUp}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openEdit(member);
              }}
              className="absolute right-4 top-16 z-10 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-brand-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-brand-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              编辑
            </button>
          </div>
        ))}
      </div>

      <MemberFormModal
        open={modalOpen}
        mode={editing ? "edit" : "add"}
        member={editing ?? undefined}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </section>
  );
}
