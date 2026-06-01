export interface Sensor {
  id: string;
  name: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  timestamp: string;
  source?: string;
}

export interface AirQualityReading {
  timestamp: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
}

export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}
