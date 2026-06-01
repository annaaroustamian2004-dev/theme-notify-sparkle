import { useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { AirQualityReading } from "@/types/air-quality";
import { BarChart3 } from "lucide-react";

const ChartFallback = () => <Skeleton className="h-[280px] w-full bg-white/5" />;
const LazyCharts = (props: { history: AirQualityReading[]; activeTab: string }) => (
  <ClientOnly fallback={<ChartFallback />}>
    {() => {
      const { PollutionAnalyticsCharts } = require("./PollutionAnalyticsCharts.client");
      return <PollutionAnalyticsCharts {...props} />;
    }}
  </ClientOnly>
);

interface PollutionAnalyticsProps {
  history: AirQualityReading[];
  loading?: boolean;
}

export function PollutionAnalytics({ history, loading }: PollutionAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("aqi");

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-slate-200">Pollution Analytics</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 h-8 mb-4">
            <TabsTrigger
              value="aqi"
              className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              AQI
            </TabsTrigger>
            <TabsTrigger
              value="pm25"
              className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              PM2.5
            </TabsTrigger>
            <TabsTrigger
              value="compare"
              className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              Compare
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <Skeleton className="h-[280px] w-full bg-white/5" />
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
              No historical data available
            </div>
          ) : (
            <>
              <TabsContent value="aqi" className="mt-0">
                <LazyCharts history={history} activeTab="aqi" />
              </TabsContent>
              <TabsContent value="pm25" className="mt-0">
                <LazyCharts history={history} activeTab="pm25" />
              </TabsContent>
              <TabsContent value="compare" className="mt-0">
                <LazyCharts history={history} activeTab="compare" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
