import { useState, useEffect } from 'react';
import { fetchWeather, fetchForecast, type WeatherData, type ForecastDay } from '../services/weatherApi';

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
}

export function useWeather(lat: number, lon: number): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [w, f] = await Promise.all([fetchWeather(lat, lon), fetchForecast(lat, lon)]);
        setWeather(w);
        setForecast(f);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lat, lon]);

  return { weather, forecast, loading, error };
}
