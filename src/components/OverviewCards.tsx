import { Card, CardContent } from "@/components/ui/card";
import { getAqiLevel } from "@/lib/aqi";
import { AqiBadge } from "@/components/AqiBadge";
import type { Sensor } from "@/types/air-quality";
import { Activity, MapPin, TrendingUp, AlertCircle } from "lucide-react";

interface OverviewCardsProps {
  sensors: Sensor[];
  selectedLocation?: { lat: number; lon: number; name?: string };
}

export function OverviewCards({ sensors, selectedLocation }: OverviewCardsProps) {
  const avgAqi = sensors.length > 0
    ? Math.round(sensors.reduce((sum, s) => sum + s.aqi, 0) / sensors.length)
    : 0;

  const maxAqi = sensors.length > 0 ? Math.max(...sensors.map((s) => s.aqi)) : 0;
  const unhealthyCount = sensors.filter((s) => s.aqi > 100).length;
  const level = getAqiLevel(avgAqi);

  const cards = [
    {
      title: "Average AQI",
      icon: Activity,
      value: avgAqi,
      sub: level.level,
      color: level.color,
      isAqi: true,
    },
    {
      title: "Sensors Monitored",
      icon: MapPin,
      value: sensors.length,
      sub: selectedLocation?.name ? `Near ${selectedLocation.name.split(",")[0]}` : "All sensors",
      color: "#3b82f6",
      isAqi: false,
    },
    {
      title: "Peak AQI",
      icon: TrendingUp,
      value: maxAqi,
      sub: getAqiLevel(maxAqi).level,
      color: getAqiLevel(maxAqi).color,
      isAqi: true,
    },
    {
      title: "Unhealthy Zones",
      icon: AlertCircle,
      value: unhealthyCount,
      sub: `${sensors.length > 0 ? Math.round((unhealthyCount / sensors.length) * 100) : 0}% of sensors`,
      color: unhealthyCount > 0 ? "#ef4444" : "#22c55e",
      isAqi: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {card.isAqi && card.value > 0 ? (
                      <AqiBadge aqi={card.value} size="lg" showLabel={false} />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: card.color }}>
                        {card.value}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: card.color + "22" }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
