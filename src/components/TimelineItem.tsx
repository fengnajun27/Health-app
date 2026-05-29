import { Activity, FileText, Heart } from "lucide-react";
import type { TimelineEvent } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const typeIcons = {
  checkup: Heart,
  lab: FileText,
  daily: Activity,
};

export function TimelineItem({ event }: { event: TimelineEvent }) {
  const Icon = typeIcons[event.type];

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white",
            event.highlight
              ? "border-brand-500 text-brand-600"
              : "border-slate-200 text-slate-400"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="mt-2 w-0.5 flex-1 bg-slate-200 last:hidden" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <time className="text-xs font-medium text-brand-600">
          {formatDate(event.date)}
        </time>
        <h3 className="mt-1 font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {event.description}
        </p>
        {event.highlight && (
          <span className="mt-2 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            重要节点
          </span>
        )}
      </div>
    </div>
  );
}
