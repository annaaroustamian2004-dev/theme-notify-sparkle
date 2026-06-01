import { AQI_LEVELS } from "@/lib/aqi";
import { Shield, AlertCircle, AlertTriangle, Skull, Wind } from "lucide-react";

const ICONS = [Wind, Shield, AlertCircle, AlertTriangle, AlertTriangle, Skull];

export function PremiumAqiGuide() {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-slate-200">AQI Guide</span>
      </div>
      <div className="space-y-3">
        {AQI_LEVELS.map((level, index) => {
          const Icon = ICONS[index] || Wind;
          return (
            <div
              key={level.level}
              className="flex items-center gap-3 group cursor-default"
            >
              <div
                className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: `${level.color}20`,
                  boxShadow: `0 0 15px ${level.color}20`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: level.color }} />
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    boxShadow: `inset 0 0 10px ${level.color}40`,
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: level.color }}
                  >
                    {level.level}
                  </span>
                  <span className="text-xs text-slate-500">
                    {level.range[0]}–{level.range[1] >= 500 ? "500+" : level.range[1]}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {level.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
