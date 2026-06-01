export interface AqiLevel {
  level: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  healthImplications: string;
  cautionaryStatement: string;
  range: [number, number];
}

export const AQI_LEVELS: AqiLevel[] = [
  {
    level: 'Good',
    color: '#00e400',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthImplications: 'None',
    cautionaryStatement: 'None',
    range: [0, 50],
  },
  {
    level: 'Moderate',
    color: '#ffff00',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    description: 'Air quality is acceptable. However, there may be a risk for some people.',
    healthImplications: 'Unusually sensitive people should consider reducing prolonged or heavy exertion.',
    cautionaryStatement: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
    range: [51, 100],
  },
  {
    level: 'Unhealthy for Sensitive Groups',
    color: '#ff7e00',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    description: 'Members of sensitive groups may experience health effects.',
    healthImplications: 'People with heart or lung disease, older adults, and children are at greater risk.',
    cautionaryStatement: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
    range: [101, 150],
  },
  {
    level: 'Unhealthy',
    color: '#ff0000',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    description: 'Some members of the general public may experience health effects.',
    healthImplications: 'Everyone may begin to experience health effects.',
    cautionaryStatement: 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion.',
    range: [151, 200],
  },
  {
    level: 'Very Unhealthy',
    color: '#8f3f97',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    healthImplications: 'Health alert: Everyone may experience more serious health effects.',
    cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
    range: [201, 300],
  },
  {
    level: 'Hazardous',
    color: '#7e0023',
    bgColor: 'bg-red-200',
    textColor: 'text-red-900',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    healthImplications: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
    cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
    range: [301, 500],
  },
];

export function getAqiLevel(aqi: number): AqiLevel {
  for (const level of AQI_LEVELS) {
    if (aqi >= level.range[0] && aqi <= level.range[1]) {
      return level;
    }
  }
  return AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function getAqiColor(aqi: number): string {
  return getAqiLevel(aqi).color;
}

export function getAqiCategory(aqi: number): string {
  return getAqiLevel(aqi).level;
}

export function calculateAqi(pm25: number): number {
  // Using EPA AQI formula for PM2.5
  const breakpoints = [
    { low: 0, high: 12.0, aqiLow: 0, aqiHigh: 50 },
    { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
    { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
    { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
    { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
    { low: 250.5, high: 350.4, aqiLow: 301, aqiHigh: 400 },
    { low: 350.5, high: 500.4, aqiLow: 401, aqiHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.low && pm25 <= bp.high) {
      return Math.round(
        ((bp.aqiHigh - bp.aqiLow) / (bp.high - bp.low)) * (pm25 - bp.low) + bp.aqiLow
      );
    }
  }
  return 500;
}
