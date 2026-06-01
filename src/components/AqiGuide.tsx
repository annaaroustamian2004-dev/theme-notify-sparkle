import { AQI_LEVELS } from "@/lib/aqi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export function AqiGuide() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4" />
          AQI Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {AQI_LEVELS.map((level) => (
          <div key={level.level} className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: level.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{level.level}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {level.range[0]}–{level.range[1] >= 500 ? "500+" : level.range[1]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{level.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
