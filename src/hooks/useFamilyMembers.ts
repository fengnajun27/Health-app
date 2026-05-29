"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearFollowUpFields,
  createMemberId,
  memberToForm,
  pickAvatarColor,
  resolveAvatarHex,
} from "@/lib/members";
import { getFamilyMembers, saveFamilyMembers } from "@/lib/storage";
import type { FamilyMemberProfile } from "@/lib/types";
import type { MemberFormValues } from "@/lib/members";

export const MEMBERS_CHANGE_EVENT = "health-members-change";

function notifyMembersChange() {
  window.dispatchEvent(new Event(MEMBERS_CHANGE_EVENT));
}

function formToMember(
  values: MemberFormValues,
  id: string,
  existing: FamilyMemberProfile[]
): FamilyMemberProfile {
  return {
    id,
    name: values.name.trim(),
    relation: values.relation.trim(),
    avatarColor: resolveAvatarHex(
      values.avatarColor || pickAvatarColor(existing)
    ),
    avatarImage: values.avatarImage || undefined,
    routineCheckupDue: values.routineCheckupDue,
    lastCheckup: values.lastCheckup || undefined,
    followUpDue: values.followUpDue || undefined,
    followUpLabel: values.followUpDue
      ? values.followUpLabel.trim() || "复查"
      : undefined,
  };
}

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMemberProfile[]>([]);
  const [ready, setReady] = useState(false);

  const reload = useCallback(() => {
    setMembers(getFamilyMembers());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
    const onChange = () => reload();
    window.addEventListener(MEMBERS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(MEMBERS_CHANGE_EVENT, onChange);
  }, [reload]);

  const persist = useCallback((next: FamilyMemberProfile[]) => {
    saveFamilyMembers(next);
    setMembers(next);
    notifyMembersChange();
  }, []);

  const addMember = useCallback(
    (values: MemberFormValues) => {
      const member = formToMember(values, createMemberId(), members);
      persist([...members, member]);
    },
    [members, persist]
  );

  const updateMember = useCallback(
    (id: string, values: MemberFormValues) => {
      const next = members.map((m) =>
        m.id === id ? formToMember(values, id, members) : m
      );
      persist(next);
    },
    [members, persist]
  );

  const deleteMember = useCallback(
    (id: string) => {
      const target = members.find((m) => m.id === id);
      if (!target) return false;
      if (target.relation === "本人") return false;
      persist(members.filter((m) => m.id !== id));
      return true;
    },
    [members, persist]
  );

  const removeFollowUp = useCallback(
    (id: string) => {
      const target = members.find((m) => m.id === id);
      if (!target || !target.followUpDue) return false;
      updateMember(id, clearFollowUpFields(memberToForm(target)));
      return true;
    },
    [members, updateMember]
  );

  return {
    members,
    ready,
    addMember,
    updateMember,
    deleteMember,
    removeFollowUp,
    reload,
  };
}
