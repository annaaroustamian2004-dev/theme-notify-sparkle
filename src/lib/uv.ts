export interface UvInfo {
  level: string;
  description: string;
  color: string;
  bgColor: string;
  protection: string;
}

export function getUvInfo(uvIndex: number): UvInfo {
  if (uvIndex <= 2) {
    return {
      level: 'Low',
      description: 'No protection required',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      protection: 'Wear sunglasses on bright days.',
    };
  } else if (uvIndex <= 5) {
    return {
      level: 'Moderate',
      description: 'Some protection recommended',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      protection: 'Seek shade during midday hours. Slip on a shirt, slop on sunscreen and slap on a hat.',
    };
  } else if (uvIndex <= 7) {
    return {
      level: 'High',
      description: 'Protection required',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      protection: 'Reduce time in the sun between 10 a.m. and 4 p.m. Cover up, wear a hat and sunglasses, and apply sunscreen SPF 30+.',
    };
  } else if (uvIndex <= 10) {
    return {
      level: 'Very High',
      description: 'Extra protection needed',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      protection: 'Minimize sun exposure between 10 a.m. and 4 p.m. Seek shade and wear protective clothing, sunglasses, and sunscreen SPF 50+.',
    };
  } else {
    return {
      level: 'Extreme',
      description: 'Avoid being outside',
      color: 'text-rose-700',
      bgColor: 'bg-rose-100',
      protection: 'Try to avoid any sun exposure between 10 a.m. and 4 p.m. Wear full protective clothing, sunglasses, and apply sunscreen SPF 50+.',
    };
  }
}
