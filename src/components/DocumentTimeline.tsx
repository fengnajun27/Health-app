"use client";

import { useState } from "react";
import { FileText, ImageIcon, Trash2, Eye, X } from "lucide-react";
import { getDocumentBlob } from "@/lib/document-store";
import { formatExamDate, groupDocumentsByDate } from "@/lib/document-utils";
import type { HealthDocument } from "@/lib/types";

interface DocumentTimelineProps {
  documents: HealthDocument[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function DocumentTimeline({
  documents,
  loading,
  onDelete,
}: DocumentTimelineProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const groups = groupDocumentsByDate(documents);

  const openPreview = async (doc: HealthDocument) => {
    const blob = await getDocumentBlob(doc.id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    if (doc.kind === "pdf") {
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }
    setPreviewTitle(doc.title);
    setPreviewUrl(url);
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">加载档案中…</p>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
        <p className="text-sm text-slate-500">暂无体检单</p>
        <p className="mt-1 text-xs text-slate-400">
          上传 PDF 或拍照后，将按日期显示在时间轴上
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.date}>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              <time className="text-sm font-semibold text-brand-700">
                {formatExamDate(group.date)}
              </time>
              <span className="text-xs text-slate-400">
                {group.items.length} 份
              </span>
            </div>
            <ul className="ml-1 space-y-2 border-l-2 border-slate-200 pl-5">
              {group.items.map((doc) => (
                <li
                  key={doc.id}
                  className="relative rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        doc.kind === "pdf"
                          ? "bg-brand-50 text-brand-600"
                          : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      {doc.kind === "pdf" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {doc.fileName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {doc.kind === "pdf" ? "PDF 报告" : "照片"} ·{" "}
                        {new Date(doc.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openPreview(doc)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      查看
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`删除「${doc.title}」？`)) onDelete(doc.id);
                      }}
                      className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[110] flex flex-col bg-black/90">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="truncate text-sm font-medium">{previewTitle}</p>
            <button
              type="button"
              onClick={closePreview}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={previewTitle}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
