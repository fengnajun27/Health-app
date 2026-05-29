"use client";

import { useRef, useState } from "react";
import { Camera, FileText, Loader2 } from "lucide-react";
import {
  MAX_FILE_SIZE,
  createDocumentId,
  detectKind,
  saveDocument,
} from "@/lib/document-store";

interface DocumentUploadProps {
  memberId: string;
  onUploaded: () => void;
}

export function DocumentUpload({ memberId, onUploaded }: DocumentUploadProps) {
  const pdfRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [examDate, setExamDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > MAX_FILE_SIZE) {
      setError("文件过大，请选择 15MB 以内的文件");
      return;
    }

    setUploading(true);
    try {
      const kind = detectKind(file);
      const doc = {
        id: createDocumentId(),
        memberId,
        examDate,
        title: title.trim() || (kind === "pdf" ? "体检报告 PDF" : "体检单照片"),
        fileName: file.name,
        mimeType: file.type || (kind === "pdf" ? "application/pdf" : "image/jpeg"),
        kind,
        createdAt: new Date().toISOString(),
      };
      await saveDocument(doc, file);
      setTitle("");
      onUploaded();
    } catch {
      setError("保存失败，请重试");
    } finally {
      setUploading(false);
      if (pdfRef.current) pdfRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
    }
  };

  const onInputChange =
    (input: React.ChangeEvent<HTMLInputElement>) => {
      const file = input.target.files?.[0];
      if (file) handleFile(file);
    };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">上传体检单</h2>
      <p className="mt-1 text-xs text-slate-500">
        支持 PDF 或拍照，按下方日期归档到时间轴
      </p>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-slate-600">体检日期</span>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-slate-600">
          备注名称（选填）
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="如：2024 年度体检"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => pdfRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 py-5 transition hover:bg-brand-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
          ) : (
            <FileText className="h-7 w-7 text-brand-600" />
          )}
          <span className="text-sm font-medium text-brand-800">上传 PDF</span>
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => imageRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 py-5 transition hover:bg-violet-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
          ) : (
            <Camera className="h-7 w-7 text-violet-600" />
          )}
          <span className="text-sm font-medium text-violet-800">拍照 / 相册</span>
        </button>
      </div>

      <input
        ref={pdfRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onInputChange}
      />
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <p className="mt-3 text-center text-xs text-slate-400">
        文件保存在本机浏览器，不会上传到服务器
      </p>
    </div>
  );
}
