import { cn } from "@/lib/utils";

export function MatchScoreBadge({ score }: { score?: number }) {
  if (score === undefined || score === null) return null;

  let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
  let label = "Match";

  if (score >= 80) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    label = "High Match";
  } else if (score >= 50) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    label = "Good Match";
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center px-3 py-1 rounded-lg border shadow-sm ring-1 ring-inset",
      colorClass
    )}>
      <span className="text-lg font-bold font-display leading-none">
        {score}%
      </span>
      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
        {label}
      </span>
    </div>
  );
}
