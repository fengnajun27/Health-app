import type { FamilyMemberProfile } from "./types";

/** 红橙黄绿青蓝紫 */
export const AVATAR_COLOR_OPTIONS = [
  { label: "红", id: "red", hex: "#ef4444" },
  { label: "橙", id: "orange", hex: "#f97316" },
  { label: "黄", id: "yellow", hex: "#facc15" },
  { label: "绿", id: "green", hex: "#22c55e" },
  { label: "青", id: "cyan", hex: "#06b6d4" },
  { label: "蓝", id: "blue", hex: "#3b82f6" },
  { label: "紫", id: "purple", hex: "#8b5cf6" },
] as const;

export const AVATAR_COLORS = AVATAR_COLOR_OPTIONS.map((o) => o.hex);

/** 兼容旧版 Tailwind 类名 */
const LEGACY_COLOR_MAP: Record<string, string> = {
  "bg-red-500": "#ef4444",
  "bg-orange-500": "#f97316",
  "bg-yellow-400": "#facc15",
  "bg-green-500": "#22c55e",
  "bg-cyan-500": "#06b6d4",
  "bg-blue-500": "#3b82f6",
  "bg-violet-500": "#8b5cf6",
  "bg-brand-500": "#3b82f6",
  "bg-rose-400": "#ef4444",
  "bg-violet-400": "#8b5cf6",
  "bg-amber-500": "#f97316",
  "bg-sky-500": "#06b6d4",
  "bg-emerald-500": "#22c55e",
  "bg-fuchsia-500": "#8b5cf6",
};

export function resolveAvatarHex(avatarColor: string): string {
  if (avatarColor.startsWith("#")) return avatarColor;
  if (LEGACY_COLOR_MAP[avatarColor]) return LEGACY_COLOR_MAP[avatarColor];
  const byId = AVATAR_COLOR_OPTIONS.find((o) => o.id === avatarColor);
  if (byId) return byId.hex;
  return AVATAR_COLOR_OPTIONS[5].hex;
}

export function isLightAvatar(hex: string): boolean {
  return resolveAvatarHex(hex) === AVATAR_COLOR_OPTIONS[2].hex;
}

export function createMemberId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function pickAvatarColor(existing: FamilyMemberProfile[]): string {
  const used = new Set(existing.map((m) => resolveAvatarHex(m.avatarColor)));
  const free = AVATAR_COLOR_OPTIONS.find((o) => !used.has(o.hex));
  return free?.hex ?? AVATAR_COLOR_OPTIONS[existing.length % AVATAR_COLOR_OPTIONS.length].hex;
}

export function emptyMemberForm(): Omit<
  FamilyMemberProfile,
  "id"
> & { avatarColor: string } {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return {
    name: "",
    relation: "",
    avatarColor: AVATAR_COLOR_OPTIONS[0].hex,
    routineCheckupDue: nextYear.toISOString().slice(0, 10),
    lastCheckup: "",
    followUpDue: "",
    followUpLabel: "",
  };
}

export function memberToForm(member: FamilyMemberProfile): MemberFormValues {
  return {
    name: member.name,
    relation: member.relation,
    routineCheckupDue: member.routineCheckupDue,
    lastCheckup: member.lastCheckup ?? "",
    followUpDue: member.followUpDue ?? "",
    followUpLabel: member.followUpLabel ?? "",
    avatarColor: resolveAvatarHex(member.avatarColor),
    avatarImage: member.avatarImage,
  };
}

export type MemberFormValues = ReturnType<typeof memberToForm>;

export function defaultFollowUpDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

export function hasFollowUp(
  data: Pick<FamilyMemberProfile, "followUpDue">
): boolean {
  return Boolean(data.followUpDue);
}

export function clearFollowUpFields(
  values: MemberFormValues
): MemberFormValues {
  return { ...values, followUpDue: "", followUpLabel: "" };
}
