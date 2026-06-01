import { getHealthRecommendations } from "@/lib/healthRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface HealthRecommendationsProps {
  aqi: number;
  uvIndex?: number;
}

const AUDIENCE_COLORS: Record<string, string> = {
  all: "#3b82f6",
  sensitive: "#f59e0b",
  general: "#22c55e",
};

export function HealthRecommendations({ aqi, uvIndex }: HealthRecommendationsProps) {
  const recommendations = getHealthRecommendations(aqi, uvIndex);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4 text-red-500" />
          Health Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => {
          const color = AUDIENCE_COLORS[rec.audience] ?? "#3b82f6";
          return (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg"
              style={{ backgroundColor: color + "11", borderLeft: `3px solid ${color}` }}
            >
              <span className="text-lg flex-shrink-0">{rec.icon}</span>
              <div>
                <p className="text-sm font-medium">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
