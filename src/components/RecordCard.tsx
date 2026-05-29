import Link from "next/link";
import { ChevronRight, Activity, FileText, Heart } from "lucide-react";
import type { HealthRecord } from "@/lib/types";
import { formatDate, statusColor } from "@/lib/utils";
import { recordTypeLabels } from "@/lib/mock-data";

const typeIcons = {
  checkup: Heart,
  lab: FileText,
  daily: Activity,
};

export function RecordCard({ record }: { record: HealthRecord }) {
  const Icon = typeIcons[record.type];

  return (
    <Link
      href={`/records/${record.id}`}
      className="block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-400">
              {recordTypeLabels[record.type]}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
          </div>
          <h3 className="mt-0.5 font-semibold text-slate-900">{record.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatDate(record.date)}
            {record.institution && ` · ${record.institution}`}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {record.summary}
          </p>
          {record.metrics && record.metrics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {record.metrics.slice(0, 3).map((m) => (
                <span
                  key={m.name}
                  className={`rounded-lg px-2 py-1 text-xs font-medium ${statusColor(m.status)}`}
                >
                  {m.name} {m.value}
                  {m.unit && ` ${m.unit}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
