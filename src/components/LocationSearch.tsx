import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentLocation } from "@/lib/geo";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name?: string) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        onLocationSelect(parseFloat(lat), parseFloat(lon), display_name);
        setQuery("");
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocate = async () => {
    setGeoLoading(true);
    try {
      const { lat, lon } = await getCurrentLocation();
      onLocationSelect(lat, lon, "Current Location");
    } catch {
      // silently ignore
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="outline" size="icon" disabled={loading || !query.trim()}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
      <Button type="button" variant="outline" size="icon" onClick={handleGeolocate} disabled={geoLoading}>
        {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
      </Button>
    </form>
  );
}
