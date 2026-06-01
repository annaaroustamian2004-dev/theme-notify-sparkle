import { Cloud, Droplets, Wind, Thermometer, Sunrise, Sunset } from "lucide-react";
import { getWeatherIcon } from "@/lib/weatherIcons";
import type { WeatherData } from "@/services/weatherApi";

interface WeatherWidgetProps {
  weather: WeatherData;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const icon = getWeatherIcon(weather.condition, weather.isDay);

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-slate-200">Weather</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{Math.round(weather.temperature)}°</span>
            <span className="text-sm text-slate-400">C</span>
          </div>
          <p className="text-xs text-slate-400 capitalize mt-0.5">{weather.condition}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <Droplets className="h-3.5 w-3.5 text-blue-400" />
          <div>
            <p className="text-[10px] text-slate-500">Humidity</p>
            <p className="text-xs font-semibold text-slate-200">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <Wind className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <p className="text-[10px] text-slate-500">Wind</p>
            <p className="text-xs font-semibold text-slate-200">{weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <Thermometer className="h-3.5 w-3.5 text-orange-400" />
          <div>
            <p className="text-[10px] text-slate-500">Feels</p>
            <p className="text-xs font-semibold text-slate-200">{Math.round(weather.feelsLike)}°</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <Sunrise className="h-3.5 w-3.5 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-500">Sunrise</p>
            <p className="text-xs font-semibold text-slate-200">{weather.sunrise}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
