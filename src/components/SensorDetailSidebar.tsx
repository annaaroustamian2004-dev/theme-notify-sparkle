import { X, MapPin, Activity, Droplets, Wind, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAqiLevel } from "@/lib/aqi";
import type { Sensor } from "@/types/air-quality";

interface SensorDetailSidebarProps {
  sensor: Sensor | null;
  onClose: () => void;
}

export function SensorDetailSidebar({ sensor, onClose }: SensorDetailSidebarProps) {
  if (!sensor) return null;

  const level = getAqiLevel(sensor.aqi);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="font-semibold text-sm text-slate-200">Sensor Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-bold text-lg text-white">{sensor.name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{sensor.city ?? "Philadelphia"}</span>
            </div>
          </div>

          {/* AQI Display */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: `linear-gradient(135deg, ${level.color}20, ${level.color}05)`,
              boxShadow: `0 0 30px ${level.color}20`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: level.color, boxShadow: `0 0 20px ${level.color}60` }}
              >
                {sensor.aqi}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Air Quality Index</p>
                <p className="text-xl font-bold" style={{ color: level.color }}>{level.level}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {new Date(sensor.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricTile
              icon={<Activity className="h-4 w-4 text-blue-400" />}
              label="PM2.5"
              value={sensor.pm25 !== undefined ? `${sensor.pm25}` : "—"}
              unit="µg/m³"
            />
            <MetricTile
              icon={<Activity className="h-4 w-4 text-slate-400" />}
              label="PM10"
              value={sensor.pm10 !== undefined ? `${sensor.pm10}` : "—"}
              unit="µg/m³"
            />
            <MetricTile
              icon={<Droplets className="h-4 w-4 text-cyan-400" />}
              label="NO₂"
              value={sensor.no2 !== undefined ? `${sensor.no2}` : "—"}
              unit="µg/m³"
            />
            <MetricTile
              icon={<Wind className="h-4 w-4 text-gray-400" />}
              label="O₃"
              value={sensor.o3 !== undefined ? `${sensor.o3}` : "—"}
              unit="µg/m³"
            />
          </div>

          <Separator className="bg-white/5" />

          {/* Health Message */}
          <div className="rounded-xl p-4 bg-white/5">
            <p className="text-sm font-medium text-slate-300 mb-2">Health Implications</p>
            <p className="text-xs text-slate-400 leading-relaxed">{level.healthImplications}</p>
          </div>

          <div className="text-xs text-slate-500">
            <p>Coordinates: {sensor.lat.toFixed(4)}, {sensor.lon.toFixed(4)}</p>
            {sensor.source && <p className="mt-1">Source: {sensor.source}</p>}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl p-3 bg-white/5 border border-white/5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        {icon}
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white">{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
