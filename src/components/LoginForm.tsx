"use client";

import { useEffect, useState } from "react";
import { Heart, Eye, EyeOff } from "lucide-react";
import { sendOtp, validatePassword } from "@/lib/auth";
import {
  getAccount,
  hasAccount,
  loginWithOtp,
  loginWithPassword,
  registerAccount,
} from "@/lib/storage";
import type { StoredUser } from "@/lib/types";
import { cn } from "@/lib/utils";

type LoginMode = "password" | "otp";

interface LoginFormProps {
  onSuccess: (user: StoredUser) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [mode, setMode] = useState<LoginMode>("password");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    const exists = hasAccount();
    setIsRegister(!exists);
    const acc = getAccount();
    if (acc) {
      setName(acc.name);
      setPhone(acc.phone);
    }
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => {
      setOtpCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  const validatePhone = (p: string) => /^1\d{10}$/.test(p);

  const handleSendOtp = () => {
    setError("");
    const trimmedPhone = phone.trim();
    if (!validatePhone(trimmedPhone)) {
      setError("请输入正确的 11 位手机号");
      return;
    }
    const code = sendOtp(trimmedPhone);
    setDemoCode(code);
    setOtpCooldown(60);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("请输入姓名");
      setLoading(false);
      return;
    }
    if (!validatePhone(trimmedPhone)) {
      setError("请输入正确的 11 位手机号");
      setLoading(false);
      return;
    }
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setError(pwdErr);
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("两次输入的密码不一致");
          setLoading(false);
          return;
        }
        const user = await registerAccount(
          trimmedName,
          trimmedPhone,
          password
        );
        onSuccess(user);
      } else {
        const result = await loginWithPassword(trimmedPhone, password);
        if (!result.ok) {
          setError(result.error);
        } else {
          onSuccess(result.user);
        }
      }
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    if (!validatePhone(trimmedPhone)) {
      setError("请输入正确的 11 位手机号");
      setLoading(false);
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("请输入 6 位验证码");
      setLoading(false);
      return;
    }

    const needName = !hasAccount();
    const result = await loginWithOtp(
      trimmedPhone,
      otp,
      needName ? trimmedName : undefined
    );

    if (!result.ok) {
      setError(result.error);
    } else {
      onSuccess(result.user);
    }
    setLoading(false);
  };

  const accountExists = hasAccount();

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
          <Heart className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">我的健康</h1>
        <p className="mt-2 text-sm text-slate-500">
          长期健康管理 · 家庭档案与体检提醒
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setError("");
              setDemoCode("");
            }}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition",
              mode === "password"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500"
            )}
          >
            密码登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("otp");
              setError("");
            }}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition",
              mode === "otp"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-500"
            )}
          >
            验证码登录
          </button>
        </div>

        {mode === "password" ? (
          <form onSubmit={handlePasswordSubmit}>
            <h2 className="text-lg font-semibold text-slate-900">
              {isRegister ? "注册账号" : "密码登录"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister
                ? "首次使用请设置登录密码（至少 6 位）"
                : "使用已注册手机号与密码登录"}
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-slate-700">姓名</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isRegister && accountExists}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
                autoComplete="name"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">手机号</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                disabled={!isRegister && accountExists}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
                autoComplete="tel"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">密码</span>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            {isRegister && (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">
                  确认密码
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  autoComplete="new-password"
                />
              </label>
            )}

            {!isRegister && accountExists && (
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="mt-3 text-sm text-brand-600 hover:text-brand-700"
              >
                忘记密码？重新注册（将覆盖本机账号）
              </button>
            )}

            {error && <ErrorBox message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "处理中…" : isRegister ? "注册并登录" : "登录"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <h2 className="text-lg font-semibold text-slate-900">验证码登录</h2>
            <p className="mt-1 text-sm text-slate-500">
              获取验证码后登录（演示模式见下方提示）
            </p>

            {!accountExists && (
              <label className="mt-5 block">
                <span className="text-sm font-medium text-slate-700">姓名</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  autoComplete="name"
                />
              </label>
            )}

            <label className={cn("block", accountExists ? "mt-5" : "mt-4")}>
              <span className="text-sm font-medium text-slate-700">手机号</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                disabled={accountExists}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 disabled:bg-slate-50"
                autoComplete="tel"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">验证码</span>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6 位数字"
                  maxLength={6}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpCooldown > 0}
                  className="shrink-0 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {otpCooldown > 0 ? `${otpCooldown}s` : "获取验证码"}
                </button>
              </div>
            </label>

            {demoCode && (
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
                演示模式验证码：
                <strong className="ml-1 tracking-widest">{demoCode}</strong>
                <span className="mt-1 block text-xs text-brand-600/80">
                  正式环境将发送至手机，5 分钟内有效
                </span>
              </p>
            )}

            {error && <ErrorBox message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "验证中…" : "登录"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        账号与密码仅保存在本机浏览器；退出登录后需重新验证
      </p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </p>
  );
}
