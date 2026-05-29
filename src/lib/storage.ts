import {
  clearOtp,
  hashPassword,
  verifyOtp,
  verifyPasswordHash,
} from "./auth";
import type { FamilyMemberProfile, StoredAccount, StoredUser } from "./types";
import { defaultFamilyMembers } from "./mock-data";

const SESSION_KEY = "health-app-user";
const ACCOUNT_KEY = "health-app-account";
const MEMBERS_KEY = "health-app-members";

/** @deprecated 兼容旧版单 key 存储 */
const LEGACY_USER_KEY = "health-app-user";

export const AUTH_CHANGE_EVENT = "health-auth-change";

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function hasAccount(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(ACCOUNT_KEY));
}

export function getAccount(): StoredAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount) : null;
  } catch {
    return null;
  }
}

function createSession(account: StoredAccount): StoredUser {
  const session: StoredUser = {
    name: account.name,
    phone: account.phone,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as StoredUser;

    // 兼容旧数据：仅有会话、无账号密码时要求重新注册
    const legacy = localStorage.getItem(LEGACY_USER_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as StoredUser & { passwordHash?: string };
      if (!old.passwordHash) {
        localStorage.removeItem(LEGACY_USER_KEY);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function registerAccount(
  name: string,
  phone: string,
  password: string
): Promise<StoredUser> {
  const account: StoredAccount = {
    name: name.trim(),
    phone: phone.trim(),
    passwordHash: await hashPassword(password),
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  initFamilyMembersIfNeeded(account.name);
  const session = createSession(account);
  notifyAuthChange();
  return session;
}

export async function loginWithPassword(
  phone: string,
  password: string
): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const account = getAccount();
  if (!account) {
    return { ok: false, error: "尚未注册，请先完成注册" };
  }
  if (account.phone !== phone.trim()) {
    return { ok: false, error: "手机号与注册账号不一致" };
  }
  const valid = await verifyPasswordHash(password, account.passwordHash);
  if (!valid) {
    return { ok: false, error: "密码错误" };
  }
  const session = createSession(account);
  notifyAuthChange();
  return { ok: true, user: session };
}

export async function loginWithOtp(
  phone: string,
  code: string,
  name?: string
): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const trimmedPhone = phone.trim();

  if (!verifyOtp(trimmedPhone, code)) {
    return { ok: false, error: "验证码错误或已过期，请重新获取" };
  }
  clearOtp(trimmedPhone);

  const account = getAccount();
  if (account) {
    if (account.phone !== trimmedPhone) {
      return { ok: false, error: "手机号与注册账号不一致" };
    }
    const session = createSession(account);
    notifyAuthChange();
    return { ok: true, user: session };
  }

  const trimmedName = name?.trim();
  if (!trimmedName) {
    return { ok: false, error: "首次登录请输入姓名" };
  }

  const randomSecret = `otp-${trimmedPhone}-${Date.now()}`;
  const user = await registerAccount(trimmedName, trimmedPhone, randomSecret);
  return { ok: true, user };
}

function initFamilyMembersIfNeeded(selfName: string) {
  const raw = localStorage.getItem(MEMBERS_KEY);
  let members: FamilyMemberProfile[] = raw
    ? (JSON.parse(raw) as FamilyMemberProfile[])
    : defaultFamilyMembers.map((m) => ({ ...m }));

  if (!raw) {
    saveFamilyMembers(members);
  }

  const self = members.find((m) => m.relation === "本人");
  if (self) {
    saveFamilyMembers(
      members.map((m) =>
        m.id === self.id ? { ...m, name: selfName } : m
      )
    );
  }
}

export function saveUser(user: Omit<StoredUser, "loggedInAt">): StoredUser {
  const data: StoredUser = {
    ...user,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));

  const account = getAccount();
  if (account) {
    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify({ ...account, name: data.name, phone: data.phone })
    );
  }

  const raw = localStorage.getItem(MEMBERS_KEY);
  let members: FamilyMemberProfile[] = raw
    ? (JSON.parse(raw) as FamilyMemberProfile[])
    : defaultFamilyMembers.map((m) => ({ ...m }));

  const self = members.find((m) => m.relation === "本人");
  if (self) {
    members = members.map((m) =>
      m.id === self.id ? { ...m, name: data.name } : m
    );
    saveFamilyMembers(members);
  }

  notifyAuthChange();
  return data;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChange();
}

export function getFamilyMembers(): FamilyMemberProfile[] {
  if (typeof window === "undefined") return defaultFamilyMembers;
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    return raw
      ? (JSON.parse(raw) as FamilyMemberProfile[])
      : defaultFamilyMembers;
  } catch {
    return defaultFamilyMembers;
  }
}

export function saveFamilyMembers(members: FamilyMemberProfile[]): void {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  notifyAuthChange();
}
