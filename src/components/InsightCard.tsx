import { AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import type { AIInsight } from "@/lib/types";
import { cn, riskBadge } from "@/lib/utils";

const categoryConfig = {
  summary: {
    icon: Sparkles,
    label: "健康总结",
    border: "border-brand-200",
    bg: "bg-brand-50",
    iconColor: "text-brand-600",
  },
  risk: {
    icon: AlertTriangle,
    label: "风险提醒",
    border: "border-amber-200",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  lifestyle: {
    icon: Lightbulb,
    label: "生活建议",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
};

export function InsightCard({ insight }: { insight: AIInsight }) {
  const config = categoryConfig[insight.category];
  const Icon = config.icon;

  return (
    <article
      className={cn(
        "rounded-2xl border p-4 shadow-sm",
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm",
            config.iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {config.label}
            </span>
            {insight.riskLevel && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  riskBadge(insight.riskLevel)
                )}
              >
                {insight.riskLevel === "low"
                  ? "低风险"
                  : insight.riskLevel === "medium"
                    ? "需关注"
                    : "高风险"}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-semibold text-slate-900">{insight.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {insight.content}
          </p>
          {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insight.relatedMetrics.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs text-slate-600"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
