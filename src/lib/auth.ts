const OTP_PREFIX = "health-app-otp:";

interface OtpRecord {
  code: string;
  expiresAt: number;
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPasswordHash(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return (await hashPassword(password)) === passwordHash;
}

const OTP_TTL_MS = 5 * 60 * 1000;

export function sendOtp(phone: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const record: OtpRecord = {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  };
  sessionStorage.setItem(`${OTP_PREFIX}${phone}`, JSON.stringify(record));
  return code;
}

export function verifyOtp(phone: string, input: string): boolean {
  const raw = sessionStorage.getItem(`${OTP_PREFIX}${phone}`);
  if (!raw) return false;
  try {
    const record = JSON.parse(raw) as OtpRecord;
    if (Date.now() > record.expiresAt) return false;
    return record.code === input.trim();
  } catch {
    return false;
  }
}

export function clearOtp(phone: string): void {
  sessionStorage.removeItem(`${OTP_PREFIX}${phone}`);
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "密码至少 6 位";
  if (password.length > 32) return "密码不超过 32 位";
  return null;
}
