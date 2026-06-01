export function getWeatherIcon(condition: string, isDay: boolean = true): string {
  const c = condition.toLowerCase();

  if (c.includes('thunder') || c.includes('storm')) return '⛈️';
  if (c.includes('drizzle') || c.includes('light rain')) return '🌦️';
  if (c.includes('rain') || c.includes('shower')) return '🌧️';
  if (c.includes('snow') || c.includes('blizzard')) return '❄️';
  if (c.includes('sleet') || c.includes('freezing')) return '🌨️';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '🌫️';
  if (c.includes('overcast') || c.includes('cloudy')) return '☁️';
  if (c.includes('partly') || c.includes('partly cloudy')) return isDay ? '⛅' : '🌤️';
  if (c.includes('clear') || c.includes('sunny')) return isDay ? '☀️' : '🌙';
  if (c.includes('wind')) return '💨';

  return isDay ? '🌤️' : '🌙';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
