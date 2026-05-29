"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { FamilyMembersSection } from "@/components/FamilyMembersSection";
import { getStoredUser } from "@/lib/storage";

export default function FamilyPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getStoredUser()) router.replace("/");
  }, [router]);

  return (
    <div>
      <PageHeader
        title="家庭成员"
        subtitle="点击编辑可修改信息，支持添加与删除"
      />
      <div className="px-4 py-6">
        <FamilyMembersSection />
      </div>
    </div>
  );
}
