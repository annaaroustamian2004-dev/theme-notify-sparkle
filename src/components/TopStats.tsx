import type { Sensor } from "@/types/air-quality";
import { AqiBadge } from "@/components/AqiBadge";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, AlertTriangle } from "lucide-react";

interface TopStatsProps {
  sensors: Sensor[];
  onSensorSelect?: (sensor: Sensor) => void;
}

export function TopStats({ sensors, onSensorSelect }: TopStatsProps) {
  const sorted = [...sensors].sort((a, b) => a.aqi - b.aqi);
  const cleanest = sorted.slice(0, 3);
  const polluted = sorted.slice(-3).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-emerald-500" />
            Cleanest Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {cleanest.map((sensor) => (
            <SensorRow key={sensor.id} sensor={sensor} onClick={() => onSensorSelect?.(sensor)} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Most Polluted Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {polluted.map((sensor) => (
            <SensorRow key={sensor.id} sensor={sensor} onClick={() => onSensorSelect?.(sensor)} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SensorRow({ sensor, onClick }: { sensor: Sensor; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{sensor.name}</p>
        <p className="text-xs text-muted-foreground truncate">{sensor.city ?? ""}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <FreshnessBadge timestamp={sensor.timestamp} />
        <AqiBadge aqi={sensor.aqi} size="sm" showLabel={false} />
      </div>
    </button>
  );
}
