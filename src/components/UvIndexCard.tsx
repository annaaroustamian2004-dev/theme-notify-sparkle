import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUvInfo } from "@/lib/uv";
import { Sun } from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  "text-green-700": "#15803d",
  "text-yellow-700": "#a16207",
  "text-orange-700": "#c2410c",
  "text-red-700": "#b91c1c",
  "text-rose-700": "#be123c",
};

interface UvIndexCardProps {
  uvIndex: number;
}

export function UvIndexCard({ uvIndex }: UvIndexCardProps) {
  const info = getUvInfo(uvIndex);
  const hex = COLOR_MAP[info.color] ?? "#6b7280";
  const percentage = Math.min(100, (uvIndex / 11) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sun className="h-4 w-4 text-yellow-500" />
          UV Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: hex }}>
            {uvIndex}
          </span>
          <span className="text-sm font-medium" style={{ color: hex }}>
            {info.level}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">{info.protection}</p>
      </CardContent>
    </Card>
  );
}
