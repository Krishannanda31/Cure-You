"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface LocationState {
  granted: boolean;
  lat: number | null;
  lng: number | null;
  error: string | null;
  requesting: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationState>({
  granted: false, lat: null, lng: null, error: null, requesting: false,
  requestLocation: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setError("Location not supported"); return; }
    setRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGranted(true);
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setError(null);
        setRequesting(false);
      },
      () => {
        setError("Location permission denied");
        setRequesting(false);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ granted, lat, lng, error, requesting, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
