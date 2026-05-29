"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DOCS_CHANGE_EVENT,
  deleteDocument,
  listDocumentsByMember,
} from "@/lib/document-store";
import type { HealthDocument } from "@/lib/types";

export function useMemberDocuments(memberId: string) {
  const [documents, setDocuments] = useState<HealthDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const list = await listDocumentsByMember(memberId);
      setDocuments(list);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    reload();
    const onChange = () => reload();
    window.addEventListener(DOCS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(DOCS_CHANGE_EVENT, onChange);
  }, [reload]);

  const remove = useCallback(
    async (id: string) => {
      await deleteDocument(id);
      await reload();
    },
    [reload]
  );

  return { documents, loading, reload, remove };
}
