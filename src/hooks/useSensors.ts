import { useState, useEffect, useCallback } from 'react';
import { fetchNearbySensors, type ApiSensor } from '../services/airQualityApi';

interface UseSensorsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseSensorsReturn {
  sensors: ApiSensor[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
  isRefreshing: boolean;
}

export function useSensors({
  autoRefresh = true,
  refreshInterval = 300000,
}: UseSensorsOptions = {}): UseSensorsReturn {
  const [sensors, setSensors] = useState<ApiSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await fetchNearbySensors();
      setSensors(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchData(false), refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return { sensors, loading, error, refresh, lastUpdated, isRefreshing };
}
