"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { MemberAvatar } from "@/components/MemberAvatar";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentTimeline } from "@/components/DocumentTimeline";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useMemberDocuments } from "@/hooks/useMemberDocuments";
import { getStoredUser } from "@/lib/storage";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;
  const { members, ready } = useFamilyMembers();
  const { documents, loading, reload, remove } = useMemberDocuments(memberId);

  const member = useMemo(
    () => members.find((m) => m.id === memberId),
    [members, memberId]
  );

  useEffect(() => {
    if (!getStoredUser()) router.replace("/");
  }, [router]);

  useEffect(() => {
    if (ready && !member) router.replace("/");
  }, [ready, member, router]);

  if (!member) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-400">加载中…</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PageHeader
        title={member.name}
        subtitle={`${member.relation} · 体检档案时间轴`}
        backHref="/"
      />

      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
        <MemberAvatar member={member} size="lg" />
        <div>
          <p className="font-semibold text-slate-900">{member.name}</p>
          <p className="text-sm text-slate-500">{member.relation}</p>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        <DocumentUpload memberId={memberId} onUploaded={reload} />

        <section>
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            档案时间轴
          </h2>
          <DocumentTimeline
            documents={documents}
            loading={loading}
            onDelete={remove}
          />
        </section>
      </div>
    </div>
  );
}
