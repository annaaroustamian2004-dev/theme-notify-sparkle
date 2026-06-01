import { getAqiLevel } from "@/lib/aqi";
import { cn } from "@/lib/utils";

interface AqiBadgeProps {
  aqi: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function AqiBadge({ aqi, size = "md", showLabel = true, className }: AqiBadgeProps) {
  const level = getAqiLevel(aqi);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: level.color + "22", color: level.color, border: `1px solid ${level.color}44` }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: size === "sm" ? 6 : 8, height: size === "sm" ? 6 : 8, backgroundColor: level.color }}
      />
      {aqi}
      {showLabel && <span className="opacity-80">{level.level}</span>}
    </span>
  );
}
