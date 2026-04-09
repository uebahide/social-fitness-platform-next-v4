import { useEffect, useState } from "react";

export function useGetCoordinates() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (!navigator.geolocation) {
      const timeoutId = window.setTimeout(() => {
        if (!isActive) return;
        setError("Geolocation is not supported on this device.");
        setLoading(false);
      }, 0);

      return () => {
        isActive = false;
        window.clearTimeout(timeoutId);
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isActive) return;
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setLoading(false);
      },
      () => {
        if (!isActive) return;
        setError("Allow location access to load local weather.");
        setLoading(false);
      },
    );

    return () => {
      isActive = false;
    };
  }, []);

  return { lat, lon, loading, error };
}
