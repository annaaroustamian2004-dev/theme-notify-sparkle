export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  description: string;
  icon: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  cityName: string;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
}

const OPEN_WEATHER_KEY = 'demo'; // Replace with actual key

function generateMockWeather(lat: number, lon: number): WeatherData {
  const conditions = [
    { condition: 'Clear', description: 'clear sky', icon: '01d' },
    { condition: 'Clouds', description: 'partly cloudy', icon: '02d' },
    { condition: 'Clouds', description: 'overcast clouds', icon: '04d' },
    { condition: 'Rain', description: 'light rain', icon: '10d' },
  ];
  const cond = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    temperature: Math.round(15 + Math.random() * 20),
    feelsLike: Math.round(13 + Math.random() * 18),
    humidity: Math.round(40 + Math.random() * 50),
    windSpeed: Math.round(Math.random() * 30),
    windDirection: Math.round(Math.random() * 360),
    pressure: Math.round(1010 + Math.random() * 20),
    visibility: Math.round(5 + Math.random() * 15),
    uvIndex: Math.round(Math.random() * 11),
    condition: cond.condition,
    description: cond.description,
    icon: cond.icon,
    isDay: true,
    sunrise: '06:30',
    sunset: '20:15',
    cityName: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
  };
}

function generateMockForecast(): ForecastDay[] {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
  const forecast: ForecastDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    forecast.push({
      date: date.toISOString(),
      maxTemp: Math.round(18 + Math.random() * 15),
      minTemp: Math.round(8 + Math.random() * 10),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      description: 'weather condition',
      icon: '01d',
      precipitation: Math.round(Math.random() * 80),
      humidity: Math.round(40 + Math.random() * 50),
      uvIndex: Math.round(1 + Math.random() * 10),
      windSpeed: Math.round(Math.random() * 25),
    });
  }

  return forecast;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );

    if (!response.ok) throw new Error('Weather API failed');

    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      windDirection: data.wind.deg || 0,
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000),
      uvIndex: 0,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      isDay: data.dt > data.sys.sunrise && data.dt < data.sys.sunset,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      cityName: data.name,
    };
  } catch {
    return generateMockWeather(lat, lon);
  }
}

export async function fetchForecast(_lat: number, _lon: number): Promise<ForecastDay[]> {
  return generateMockForecast();
}
