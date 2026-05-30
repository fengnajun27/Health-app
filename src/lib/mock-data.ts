import type { FamilyMemberProfile } from "./types";

export const defaultFamilyMembers: FamilyMemberProfile[] = [
  {
    id: "self",
    name: "小明",
    relation: "本人",
    avatarColor: "#3b82f6",
    routineCheckupDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .slice(0, 10),
  },
];
