import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherIcon, getWindDirection } from "@/lib/weatherIcons";
import { getUvInfo } from "@/lib/uv";
import type { WeatherData } from "@/services/weatherApi";
import { Droplets, Wind, Eye, Thermometer } from "lucide-react";

const UV_COLOR_MAP: Record<string, string> = {
  "text-green-700": "#15803d",
  "text-yellow-700": "#a16207",
  "text-orange-700": "#c2410c",
  "text-red-700": "#b91c1c",
  "text-rose-700": "#be123c",
};

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const icon = getWeatherIcon(weather.condition, weather.isDay);
  const windDir = getWindDirection(weather.windDirection);
  const uvInfo = getUvInfo(weather.uvIndex);
  const uvHex = UV_COLOR_MAP[uvInfo.color] ?? "#6b7280";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Current Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{Math.round(weather.temperature)}°</span>
              <span className="text-lg text-muted-foreground">C</span>
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-1">{weather.condition}</p>
            <p className="text-xs text-muted-foreground">Feels like {Math.round(weather.feelsLike)}°C</p>
          </div>
          <span className="text-5xl">{icon}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-medium">{weather.windSpeed} km/h {windDir}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-medium">{weather.visibility} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="h-4 w-4 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">UV Index</p>
              <p className="font-medium" style={{ color: uvHex }}>{weather.uvIndex} {uvInfo.level}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
