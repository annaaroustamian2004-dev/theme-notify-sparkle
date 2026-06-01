import { Activity, TrendingUp, TrendingDown, Minus, MapPin, AlertTriangle } from "lucide-react";
import { getAqiLevel } from "@/lib/aqi";
import type { Sensor } from "@/types/air-quality";

interface PremiumStatsProps {
  avgAqi: number;
  maxSensor: Sensor | null;
  trend: number;
}

export function PremiumStats({ avgAqi, maxSensor, trend }: PremiumStatsProps) {
  const level = getAqiLevel(avgAqi);
  const maxLevel = maxSensor ? getAqiLevel(maxSensor.aqi) : null;

  const getGlowClass = (aqi: number) => {
    if (aqi <= 50) return "glow-green";
    if (aqi <= 100) return "glow-yellow";
    if (aqi <= 150) return "glow-orange";
    return "glow-red";
  };

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-red-400" : trend < 0 ? "text-emerald-400" : "text-slate-400";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Average AQI Card */}
      <div className={`metric-card ${getGlowClass(avgAqi)}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              City Average AQI
            </p>
            <div className="flex items-baseline gap-3">
              <span
                className="text-5xl font-bold tracking-tight"
                style={{ color: level.color }}
              >
                {avgAqi}
              </span>
              <span className="text-lg font-medium text-slate-300">{level.level}</span>
            </div>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${level.color}20` }}
          >
            <Activity className="h-6 w-6" style={{ color: level.color }} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (avgAqi / 500) * 100)}%`,
                backgroundColor: level.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Most Polluted Station */}
      <div className="metric-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Most Polluted Area
            </p>
            {maxSensor ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: maxLevel?.color }}
                  >
                    {maxSensor.aqi}
                  </span>
                  <span className="text-sm font-medium text-slate-300">AQI</span>
                </div>
                <p className="mt-2 text-sm text-slate-400 truncate max-w-[200px]">
                  {maxSensor.name}
                </p>
              </>
            ) : (
              <span className="text-2xl font-bold text-slate-400">—</span>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Trend Card */}
      <div className="metric-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Hourly Trend
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold tracking-tight ${trendColor}`}>
                {trend > 0 ? "+" : ""}{trend}
              </span>
              <span className="text-sm font-medium text-slate-300">AQI change</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {trend > 0 ? "Air quality worsening" : trend < 0 ? "Air quality improving" : "Stable conditions"}
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            trend > 0 ? "bg-red-500/20" : trend < 0 ? "bg-emerald-500/20" : "bg-slate-500/20"
          }`}>
            <TrendIcon className={`h-6 w-6 ${trendColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
