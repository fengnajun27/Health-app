"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/auth";
import {
  getAccount,
  hasAccount,
  loginWithPassword,
  registerAccount,
} from "@/lib/storage";
import type { StoredUser } from "@/lib/types";

interface LoginFormProps {
  onSuccess: (user: StoredUser) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const exists = hasAccount();
    setIsRegister(!exists);
    const acc = getAccount();
    if (acc) {
      setName(acc.name);
      setPhone(acc.phone);
    }
  }, []);

  const validatePhone = (p: string) => /^1\d{10}$/.test(p);

  const handleSubmit = async (e: React.FormEvent) => {
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
        const user = await registerAccount(trimmedName, trimmedPhone, password);
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

  const accountExists = hasAccount();

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-5xl shadow-sm">
          🧑‍🧑‍🧒
        </span>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">我的健康</h1>
        <p className="mt-2 text-sm text-slate-500">
          长期健康管理 · 家庭档案与体检提醒
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {isRegister ? "注册账号" : "密码登录"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isRegister
            ? "首次使用请设置登录密码（至少 6 位）"
            : "使用已注册手机号与密码登录"}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
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

          <label className="block">
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

          <label className="block">
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
            <label className="block">
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
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              忘记密码？重新注册（将覆盖本机账号）
            </button>
          )}

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "处理中…" : isRegister ? "注册并登录" : "登录"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        账号与密码仅保存在本机浏览器；退出登录后需重新验证
      </p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </p>
  );
}
