/** 登录会话（不含密码） */
export interface StoredUser {
  name: string;
  phone: string;
  loggedInAt: string;
}

/** 本机账号（含密码哈希） */
export interface StoredAccount {
  name: string;
  phone: string;
  passwordHash: string;
}

export type ReminderKind = "routine" | "followup";

export interface HealthReminder {
  id: string;
  memberId: string;
  memberName: string;
  relation: string;
  kind: ReminderKind;
  title: string;
  dueDate: string;
}

export interface FamilyMemberProfile {
  id: string;
  name: string;
  relation: string;
  /** 头像背景色（#十六进制），红橙黄绿青蓝紫 */
  avatarColor: string;
  /** 压缩后的照片 data URL，可选 */
  avatarImage?: string;
  routineCheckupDue: string;
  followUpDue?: string;
  followUpLabel?: string;
  lastCheckup?: string;
}

export type DocumentKind = "pdf" | "image";

export interface HealthDocument {
  id: string;
  memberId: string;
  examDate: string;
  title: string;
  fileName: string;
  mimeType: string;
  kind: DocumentKind;
  createdAt: string;
}
