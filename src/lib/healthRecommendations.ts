import { getAqiLevel } from './aqi';

export interface Recommendation {
  icon: string;
  title: string;
  description: string;
  audience: 'general' | 'sensitive' | 'all';
}

export function getHealthRecommendations(aqi: number, uvIndex?: number): Recommendation[] {
  const aqiLevel = getAqiLevel(aqi);
  const recommendations: Recommendation[] = [];

  if (aqi <= 50) {
    recommendations.push({
      icon: '🏃',
      title: 'Great for outdoor activities',
      description: 'Air quality is excellent. Perfect conditions for outdoor exercise and activities.',
      audience: 'all',
    });
  } else if (aqi <= 100) {
    recommendations.push({
      icon: '😷',
      title: 'Unusually sensitive individuals',
      description: aqiLevel.cautionaryStatement,
      audience: 'sensitive',
    });
    recommendations.push({
      icon: '🌬️',
      title: 'General advice',
      description: 'Air quality is acceptable. Most people can enjoy outdoor activities.',
      audience: 'general',
    });
  } else if (aqi <= 150) {
    recommendations.push({
      icon: '⚠️',
      title: 'Sensitive groups at risk',
      description: 'Children, elderly, and people with heart or lung disease should reduce outdoor activities.',
      audience: 'sensitive',
    });
    recommendations.push({
      icon: '🏠',
      title: 'Consider indoor alternatives',
      description: 'Consider moving prolonged outdoor activities indoors or rescheduling.',
      audience: 'general',
    });
  } else if (aqi <= 200) {
    recommendations.push({
      icon: '🚫',
      title: 'Limit outdoor activities',
      description: 'Everyone should reduce prolonged or heavy outdoor exertion.',
      audience: 'all',
    });
    recommendations.push({
      icon: '😷',
      title: 'Consider wearing a mask',
      description: 'If you must go outside, consider wearing an N95 mask.',
      audience: 'all',
    });
  } else {
    recommendations.push({
      icon: '🏠',
      title: 'Stay indoors',
      description: 'Avoid all outdoor physical activity. Keep windows and doors closed.',
      audience: 'all',
    });
    recommendations.push({
      icon: '🌬️',
      title: 'Use air purifiers',
      description: 'Run air purifiers with HEPA filters to improve indoor air quality.',
      audience: 'all',
    });
  }

  if (uvIndex !== undefined && uvIndex >= 6) {
    recommendations.push({
      icon: '☀️',
      title: 'High UV Index',
      description: `UV Index is ${uvIndex}. Apply SPF 30+ sunscreen and wear protective clothing.`,
      audience: 'all',
    });
  }

  return recommendations;
}
