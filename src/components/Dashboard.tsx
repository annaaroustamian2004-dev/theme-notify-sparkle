import { useState, useCallback, useEffect } from "react";
import { PremiumSensorMap } from "@/components/PremiumSensorMap";
import { PremiumStats } from "@/components/PremiumStats";
import { PremiumAqiGuide } from "@/components/PremiumAqiGuide";
import { PollutionAnalytics } from "@/components/PollutionAnalytics";
import { WeatherWidget } from "@/components/WeatherWidget";
import { SensorDetailSidebar } from "@/components/SensorDetailSidebar";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useSensors } from "@/hooks/useSensors";
import { useWeather } from "@/hooks/useWeather";
import { fetchSensorHistory } from "@/services/airQualityApi";
import type { Sensor, AirQualityReading } from "@/types/air-quality";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

const PHILADELPHIA_CENTER = { lat: 39.9526, lon: -75.1652 };

export function Dashboard() {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [history, setHistory] = useState<AirQualityReading[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { sensors, loading, error, refresh, lastUpdated } = useSensors({
    autoRefresh: true,
    refreshInterval: 300000,
  });

  const { weather } = useWeather(PHILADELPHIA_CENTER.lat, PHILADELPHIA_CENTER.lon);

  const handleSensorSelect = useCallback(async (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setHistoryLoading(true);
    try {
      const data = await fetchSensorHistory(sensor.id, 24);
      setHistory(data);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sensors.length > 0 && history.length === 0) {
      const first = sensors[0];
      setHistoryLoading(true);
      fetchSensorHistory(first.id, 24)
        .then(setHistory)
        .finally(() => setHistoryLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensors]);

  const avgAqi = sensors.length > 0
    ? Math.round(sensors.reduce((sum, s) => sum + s.aqi, 0) / sensors.length)
    : 0;

  const maxAqiSensor = sensors.length > 0
    ? sensors.reduce((max, s) => s.aqi > max.aqi ? s : max, sensors[0])
    : null;

  const hourlyTrend = history.length >= 2
    ? ((history[history.length - 1]?.aqi || 0) - (history[history.length - 2]?.aqi || 0))
    : 0;

  if (loading && sensors.length === 0) {
    return <LoadingState message="Connecting to Philadelphia Air Quality Network..." />;
  }

  if (error && sensors.length === 0) {
    return <ErrorState onRetry={refresh} />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Air Quality Dashboard</h2>
            <p className="text-slate-400 text-sm">Real-time monitoring from OpenDataPhilly</p>
          </div>
          <p className="text-xs text-slate-500">{sensors.length} active sensors</p>
        </div>

        {/* Premium Stats Row */}
        <PremiumStats avgAqi={avgAqi} maxSensor={maxAqiSensor} trend={hourlyTrend} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Map - Full Width */}
          <div className="xl:col-span-3">
            <PremiumSensorMap
              sensors={sensors}
              center={PHILADELPHIA_CENTER}
              onSensorSelect={handleSensorSelect}
              selectedSensor={selectedSensor}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Weather Widget */}
            {weather && <WeatherWidget weather={weather} />}

            {/* AQI Guide */}
            <PremiumAqiGuide />
          </div>
        </div>

        {/* Analytics */}
        <PollutionAnalytics history={history} loading={historyLoading} />

        {lastUpdated && (
          <p className="text-xs text-slate-500 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Sensor Detail Sidebar */}
      {selectedSensor && (
        <SensorDetailSidebar
          sensor={selectedSensor}
          onClose={() => setSelectedSensor(null)}
        />
      )}
    </div>
  );
}
