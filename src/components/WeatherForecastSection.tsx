import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/weatherIcons";
import type { ForecastDay } from "@/services/weatherApi";

interface WeatherForecastSectionProps {
  forecast: ForecastDay[];
}

export function WeatherForecastSection({ forecast }: WeatherForecastSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecast.map((day, index) => {
            const icon = getWeatherIcon(day.condition, true);
            const date = new Date(day.date);
            const dayName = index === 0
              ? "Today"
              : date.toLocaleDateString("en-US", { weekday: "short" });

            return (
              <div key={day.date} className="flex items-center justify-between gap-4 py-1.5">
                <span className="text-sm w-12 text-muted-foreground">{dayName}</span>
                <span className="text-lg">{icon}</span>
                <span className="flex-1 text-xs text-muted-foreground capitalize">{day.condition}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{Math.round(day.minTemp)}°</span>
                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                      style={{
                        width: `${Math.min(100, ((day.maxTemp - day.minTemp) / 20) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium">{Math.round(day.maxTemp)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
