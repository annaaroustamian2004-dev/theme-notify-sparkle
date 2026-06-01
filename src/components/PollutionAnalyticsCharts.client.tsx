import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AirQualityReading } from "@/types/air-quality";

interface ChartsProps {
  history: AirQualityReading[];
  activeTab: string;
}

const CHART_COLORS = {
  aqi: "#3b82f6",
  pm25: "#f59e0b",
  pm10: "#64748b",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-slate-400 mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm font-semibold" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PollutionAnalyticsCharts({ history, activeTab }: ChartsProps) {
  const data = history.map((r) => ({
    time: new Date(r.timestamp).toLocaleDateString("en-US", { weekday: "short", hour: "numeric" }),
    aqi: r.aqi,
    pm25: r.pm25,
    pm10: r.pm10 ?? 0,
  }));

  if (activeTab === "aqi") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.aqi} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.aqi} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="aqi" stroke={CHART_COLORS.aqi} fill="url(#aqiGrad)" strokeWidth={2} name="AQI" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (activeTab === "pm25") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="pm25" stroke={CHART_COLORS.pm25} strokeWidth={2} dot={false} name="PM2.5 (µg/m³)" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pm25" fill={CHART_COLORS.pm25} name="PM2.5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pm10" fill={CHART_COLORS.pm10} name="PM10" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
