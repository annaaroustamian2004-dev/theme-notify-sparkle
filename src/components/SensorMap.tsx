import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiColor } from "@/lib/aqi";
import type { Sensor } from "@/types/air-quality";
import { Map } from "lucide-react";

interface SensorMapProps {
  sensors: Sensor[];
  center: { lat: number; lon: number };
  onSensorSelect?: (sensor: Sensor) => void;
  selectedSensor?: Sensor | null;
}

export function SensorMap({ sensors, center, onSensorSelect, selectedSensor }: SensorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let L: typeof import("leaflet");
    let map: import("leaflet").Map;

    const initMap = async () => {
      try {
        L = (await import("leaflet")).default;

        // Fix default icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        if (!mapRef.current) return;
        map = L.map(mapRef.current).setView([center.lat, center.lon], 11);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        sensors.forEach((sensor) => {
          const color = getAqiColor(sensor.aqi);
          const icon = L.divIcon({
            html: `<div style="
              background:${color};
              color:#fff;
              border-radius:50%;
              width:32px;
              height:32px;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:700;
              font-size:11px;
              border:2px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              cursor:pointer;
            ">${sensor.aqi}</div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([sensor.lat, sensor.lon], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width:160px">
                <strong>${sensor.name}</strong><br/>
                <small>${sensor.city}</small><br/>
                <div style="margin-top:6px">AQI: <strong style="color:${color}">${sensor.aqi}</strong></div>
                ${sensor.pm25 !== undefined ? `<div>PM2.5: ${sensor.pm25} µg/m³</div>` : ""}
              </div>
            `);

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

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSensor) return;
    const map = mapInstanceRef.current as import("leaflet").Map;
    map.setView([selectedSensor.lat, selectedSensor.lon], 13, { animate: true });
  }, [selectedSensor]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="h-4 w-4" />
          Sensor Map
          <span className="ml-auto text-xs text-muted-foreground font-normal">{sensors.length} sensors</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="h-[400px] w-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
}
