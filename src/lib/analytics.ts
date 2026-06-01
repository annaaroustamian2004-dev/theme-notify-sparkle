export interface PollutantReading {
  timestamp: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  aqi: number;
}

export interface TrendData {
  label: string;
  value: number;
  change: number;
  changePercent: number;
}

export function calculateTrend(readings: PollutantReading[], key: keyof PollutantReading): TrendData {
  if (readings.length < 2) {
    return { label: key as string, value: 0, change: 0, changePercent: 0 };
  }

  const latest = readings[readings.length - 1][key] as number;
  const previous = readings[readings.length - 2][key] as number;
  const change = latest - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

  return {
    label: key as string,
    value: latest,
    change,
    changePercent,
  };
}

export function groupByHour(readings: PollutantReading[]): PollutantReading[] {
  const grouped = new Map<string, PollutantReading[]>();

  for (const reading of readings) {
    const hour = new Date(reading.timestamp).toISOString().slice(0, 13);
    if (!grouped.has(hour)) {
      grouped.set(hour, []);
    }
    grouped.get(hour)!.push(reading);
  }

  return Array.from(grouped.entries()).map(([hour, group]) => {
    const avg = (key: keyof PollutantReading) =>
      group.reduce((sum, r) => sum + (r[key] as number), 0) / group.length;

    return {
      timestamp: hour + ':00:00Z',
      pm25: Math.round(avg('pm25') * 10) / 10,
      pm10: Math.round(avg('pm10') * 10) / 10,
      no2: Math.round(avg('no2') * 10) / 10,
      o3: Math.round(avg('o3') * 10) / 10,
      co: Math.round(avg('co') * 10) / 10,
      so2: Math.round(avg('so2') * 10) / 10,
      aqi: Math.round(avg('aqi')),
    };
  });
}
