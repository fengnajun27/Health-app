"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { AVATAR_COLOR_OPTIONS, resolveAvatarHex } from "@/lib/members";
import { compressAvatarFile } from "@/lib/avatar-utils";
import { MemberAvatar } from "@/components/MemberAvatar";
import { cn } from "@/lib/utils";

export interface AvatarPickerValue {
  name: string;
  avatarColor: string;
  avatarImage?: string;
}

interface AvatarPickerProps {
  value: AvatarPickerValue;
  onChange: (patch: Partial<AvatarPickerValue>) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File) => {
    setUploadError("");
    try {
      const dataUrl = await compressAvatarFile(file);
      onChange({ avatarImage: dataUrl });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "上传失败");
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-sm font-medium text-slate-700">头像</p>
      <p className="mt-0.5 text-xs text-slate-500">
        上传照片，或选择颜色显示姓名首字
      </p>

      <div className="mt-4 flex items-center gap-4">
        <MemberAvatar
          member={{
            name: value.name || "?",
            avatarColor: value.avatarColor,
            avatarImage: value.avatarImage,
          }}
          size="lg"
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-slate-200 hover:bg-brand-50"
          >
            <Camera className="h-4 w-4" />
            上传照片
          </button>
          {value.avatarImage && (
            <button
              type="button"
              onClick={() => onChange({ avatarImage: undefined })}
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              移除照片，改用颜色
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-600">
          <ImageIcon className="h-3.5 w-3.5" />
          选择颜色（无照片时显示）
        </p>
        <div className="flex flex-wrap justify-between gap-3">
          {AVATAR_COLOR_OPTIONS.map(({ label, hex }) => {
            const selected = resolveAvatarHex(value.avatarColor) === hex;
            return (
              <button
                key={hex}
                type="button"
                onClick={() => onChange({ avatarColor: hex })}
                aria-label={`选择${label}色`}
              >
                <span
                  style={{ backgroundColor: hex }}
                  className={cn(
                    "block h-9 w-9 rounded-full ring-2 ring-offset-2 transition",
                    selected ? "ring-brand-600" : "ring-transparent"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {uploadError && (
        <p className="mt-3 text-xs text-red-600">{uploadError}</p>
      )}
    </div>
  );
}
