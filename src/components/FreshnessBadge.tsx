import { getFreshnessInfo } from "@/lib/freshness";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  "text-green-600": "#16a34a",
  "text-yellow-600": "#ca8a04",
  "text-orange-600": "#ea580c",
  "text-red-600": "#dc2626",
};

interface FreshnessBadgeProps {
  timestamp: string | Date;
  className?: string;
}

export function FreshnessBadge({ timestamp, className }: FreshnessBadgeProps) {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const info = getFreshnessInfo(date);
  const hex = COLOR_MAP[info.color] ?? "#6b7280";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: hex + "22", color: hex, border: `1px solid ${hex}44` }}
    >
      <Clock className="h-3 w-3" />
      {info.label}
    </span>
  );
}
