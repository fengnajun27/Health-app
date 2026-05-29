import type { FamilyMemberProfile } from "./types";

export const defaultFamilyMembers: FamilyMemberProfile[] = [
  {
    id: "self",
    name: "冯钠珺",
    relation: "本人",
    avatarColor: "#3b82f6",
    lastCheckup: "2024-10-15",
    routineCheckupDue: "2025-10-15",
    followUpDue: "2025-05-30",
    followUpLabel: "甲状腺复查",
  },
  {
    id: "m1",
    name: "任碧辉",
    relation: "母亲",
    avatarColor: "#ef4444",
    lastCheckup: "2025-03-01",
    routineCheckupDue: "2026-03-01",
    followUpDue: "2025-06-15",
    followUpLabel: "胃镜随访",
  },
  {
    id: "m2",
    name: "冯继赢",
    relation: "父亲",
    avatarColor: "#22c55e",
    lastCheckup: "2025-01-18",
    routineCheckupDue: "2026-01-18",
  },
];
