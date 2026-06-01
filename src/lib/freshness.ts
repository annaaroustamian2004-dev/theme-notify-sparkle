export type FreshnessStatus = 'fresh' | 'recent' | 'stale' | 'very-stale';

export interface FreshnessInfo {
  status: FreshnessStatus;
  label: string;
  color: string;
  bgColor: string;
  minutesAgo: number;
}

export function getFreshnessInfo(timestamp: string | Date): FreshnessInfo {
  const now = new Date();
  const ts = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const diffMs = now.getTime() - ts.getTime();
  const minutesAgo = Math.floor(diffMs / (1000 * 60));

  if (minutesAgo < 15) {
    return {
      status: 'fresh',
      label: minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      minutesAgo,
    };
  } else if (minutesAgo < 60) {
    return {
      status: 'recent',
      label: `${minutesAgo}m ago`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      minutesAgo,
    };
  } else if (minutesAgo < 240) {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return {
      status: 'stale',
      label: `${hoursAgo}h ago`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      minutesAgo,
    };
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return {
      status: 'very-stale',
      label: hoursAgo > 24 ? `${Math.floor(hoursAgo / 24)}d ago` : `${hoursAgo}h ago`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      minutesAgo,
    };
  }
}
