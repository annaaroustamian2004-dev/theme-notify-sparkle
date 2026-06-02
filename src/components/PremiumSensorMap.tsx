import { useEffect, useRef } from "react";
import { getAqiColor, getAqiLevel } from "@/lib/aqi";
import type { Sensor } from "@/types/air-quality";
import { Map } from "lucide-react";

interface PremiumSensorMapProps {
  sensors: Sensor[];
  center: { lat: number; lon: number };
  onSensorSelect?: (sensor: Sensor) => void;
  selectedSensor?: Sensor | null;
}

export function PremiumSensorMap({ sensors, center, onSensorSelect, selectedSensor }: PremiumSensorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let L: typeof import("leaflet");
    let map: import("leaflet").Map;

    const initMap = async () => {
      try {
        L = (await import("leaflet")).default;
        leafletRef.current = L;

        // Fix default icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        if (!mapRef.current) return;
        map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([center.lat, center.lon], 12);

        mapInstanceRef.current = map;

        const isDark = document.documentElement.classList.contains("dark");
        const tileUrl = isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        sensors.forEach((sensor) => {
          const color = getAqiColor(sensor.aqi);
          const level = getAqiLevel(sensor.aqi);

          const icon = L.divIcon({
            html: `
              <div style="
                background: ${color};
                color: #fff;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 14px;
                border: 3px solid rgba(255,255,255,0.9);
                box-shadow: 0 4px 12px ${color}66, 0 0 20px ${color}44;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                font-family: 'Inter', sans-serif;
              ">${sensor.aqi}</div>
            `,
            className: "custom-marker",
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });

          const marker = L.marker([sensor.lat, sensor.lon], { icon }).addTo(map);

          marker.bindPopup(`
            <div style="
              min-width: 180px;
              padding: 8px;
              background: #1e293b;
              border-radius: 12px;
              font-family: 'Inter', sans-serif;
            ">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: ${color};
                  box-shadow: 0 0 8px ${color}66;
                "></div>
                <span style="font-weight: 600; color: #f1f5f9;">${sensor.name}</span>
              </div>
              <div style="font-size: 24px; font-weight: 700; color: ${color}; margin-bottom: 4px;">
                ${sensor.aqi} AQI
              </div>
              <div style="font-size: 12px; color: #94a3b8;">${level.level}</div>
              ${sensor.pm25 !== undefined ? `<div style="margin-top: 8px; font-size: 11px; color: #64748b;">PM2.5: ${sensor.pm25} µg/m³</div>` : ""}
            </div>
          `, {
            className: "custom-popup",
          });

          marker.on("click", () => {
            onSensorSelect?.(sensor);
          });

          (markersRef.current as import("leaflet").Marker[]).push(marker);
        });
      } catch {
        // silently ignore
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to theme changes by swapping the tile layer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const L = leafletRef.current;
      const map = mapInstanceRef.current as import("leaflet").Map | null;
      if (!L || !map) return;
      const isDark = document.documentElement.classList.contains("dark");
      const url = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      tileLayerRef.current = L.tileLayer(url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSensor) return;
    const map = mapInstanceRef.current as import("leaflet").Map;
    map.setView([selectedSensor.lat, selectedSensor.lon], 14, { animate: true });
  }, [selectedSensor]);

  return (
    <div className="metric-card overflow-hidden !p-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-slate-200">Sensor Network</span>
        </div>
        <span className="text-xs text-slate-500">{sensors.length} stations</span>
      </div>
      <div ref={mapRef} className="h-[480px] w-full rounded-b-2xl" />
    </div>
  );
}
