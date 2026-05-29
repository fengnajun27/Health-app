import type { DailyVital } from "@/lib/types";

export function VitalGrid({ vitals }: { vitals: DailyVital[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {vitals.map((v) => (
        <div
          key={v.id}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-400">{v.label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {v.value}
            <span className="ml-1 text-sm font-normal text-slate-500">
              {v.unit}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{v.recordedAt}</p>
        </div>
      ))}
    </div>
  );
}
