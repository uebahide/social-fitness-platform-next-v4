"use client";

import { Button } from "@/components/buttons/Button";
import { WeatherCardSkeleton } from "@/components/skeletons/WeatherCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useGetCoordinates } from "@/hooks/useGetCoordinates";
import {
  getWeatherCardData,
} from "@/lib/client/getWeatherCardData";

const weatherIcons = {
  0: { icon: "☀️", label: "Sunny" }, // Clear sky
  1: { icon: "🌤️", label: "Sunny" }, // Mainly clear
  2: { icon: "⛅", label: "Cloudy" }, // Partly cloudy
  3: { icon: "☁️", label: "Cloudy" }, // Overcast
  45: { icon: "🌫️", label: "Fog" }, // Fog
  48: { icon: "🌫️", label: "Fog" }, // Depositing rime fog
  51: { icon: "🌦️", label: "Rain" }, // Light drizzle
  53: { icon: "🌦️", label: "Rain" }, // Moderate drizzle
  55: { icon: "🌧️", label: "Rain" }, // Dense drizzle
  61: { icon: "🌧️", label: "Rain" }, // Light rain
  63: { icon: "🌧️", label: "Rain" }, // Moderate rain
  65: { icon: "🌧️", label: "Rain" }, // Heavy rain
  71: { icon: "🌨️", label: "Snow" }, // Light snow
  73: { icon: "❄️", label: "Snow" }, // Moderate snow
  75: { icon: "❄️", label: "Snow" }, // Heavy snow
  80: { icon: "🌦️", label: "Rain" }, // Rain showers
  95: { icon: "⛈️", label: "Thunderstorm" }, // Thunderstorm
};

export const WeatherCard = () => {
  const { lat, lon, loading: isLoadingCoordinates, error: locationError } =
    useGetCoordinates();
  const hasCoordinates = lat !== null && lon !== null;
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weather-card-data", lat, lon],
    queryFn: ({ signal }) =>
      getWeatherCardData(lat as number, lon as number, signal),
    enabled: hasCoordinates,
  });

  const weather = data?.weather;
  const location = data?.location;
  const dailyForecast = data?.dailyForecast;

  if (isLoadingCoordinates || (hasCoordinates && isPending)) {
    return <WeatherCardSkeleton />;
  }

  if (locationError) {
    return (
      <WeatherCardStatus
        title="Location unavailable"
        description={locationError}
      />
    );
  }

  if (isError) {
    return (
      <WeatherCardStatus
        title="Weather unavailable"
        description="Could not load weather data right now."
        action={
          <Button color="secondary" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <section className="col-span-1 row-span-1">
      <div className="bg-card relative space-y-8 rounded-xl border border-gray-200 px-7 py-6">
        <div className="flex items-end gap-x-4">
          <p className="text-4xl font-medium">
            {new Date().toLocaleDateString("en-US", { month: "long" })}
          </p>
          <p className="text-5xl">
            {new Date().toLocaleDateString("en-US", { day: "numeric" })}
          </p>
        </div>
        <header className="flex gap-x-4">
          <span className="text-6xl">
            {
              weatherIcons[weather?.weathercode as keyof typeof weatherIcons]
                ?.icon
            }
          </span>
          <div className="flex flex-col text-xl">
            <span className="text-xl">
              {
                weatherIcons[weather?.weathercode as keyof typeof weatherIcons]
                  ?.label
              }
            </span>
            <div className="flex gap-x-1">
              <span className="text-2xl font-medium">
                {weather?.temperature}
              </span>
              <span className="text-sm">°C</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-medium">{location?.country}</p>
            <p className="text-md font-medium">
              {location?.city ?? location?.town}
            </p>
          </div>
        </header>
        <ul className="flex justify-between">
          {dailyForecast?.map((day) => (
            <li key={day.date} className="flex flex-col items-center gap-y-2">
              <p className="text-xl font-medium">{day.date}</p>
              <p className="text-2xl">
                {
                  weatherIcons[day.weatherCode as keyof typeof weatherIcons]
                    ?.icon
                }
              </p>
              <p className="text-xs">{day.max}°C</p>
              <p className="text-xs">{day.min}°C</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

function WeatherCardStatus({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="col-span-1 row-span-1">
      <div className="bg-card flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 px-7 py-6 text-center">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {action}
      </div>
    </section>
  );
}
