"use client";

import { useEffect, useState } from "react";
import { WeatherCardSkeleton } from "@/components/skeltons/WeatherCardSkeleton";

type DailyForecast = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
};

type WeatherResponse = {
  current_weather: {
    weathercode: number;
    temperature: number;
  };
  daily: DailyForecast;
};

type LocationResponse = {
  address: {
    country?: string;
    city?: string;
    town?: string;
  };
};

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

export const WeatherCard = ({}) => {
  const [weather, setWeather] = useState<WeatherResponse["current_weather"] | null>(null);
  const [location, setLocation] = useState<LocationResponse["address"] | null>(null);
  const [dailyForecast, setDailyForecast] = useState<
    | {
        date: string;
        weatherCode: number;
        max: number;
        min: number;
      }[]
    | null
  >([]);
  const [loading, setLoading] = useState(true); // loading state for the weather data

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const [weatherRes, locationRes, dailyForecastRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          ),
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`,
          ),
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`,
          ),
        ]);

        const weatherData: WeatherResponse = await weatherRes.json();
        const locationData: LocationResponse = await locationRes.json();
        const dailyForecastData: WeatherResponse = await dailyForecastRes.json();
        const mapped = dailyForecastData.daily.time.map(
          (date: string, index: number) => ({
            date: date.split("-")[2],
            weatherCode: dailyForecastData.daily.weather_code[index],
            max: dailyForecastData.daily.temperature_2m_max[index],
            min: dailyForecastData.daily.temperature_2m_min[index],
          }),
        );

        setDailyForecast(mapped);
        setWeather(weatherData.current_weather);
        setLocation(locationData.address);
        setLoading(false);
      });
    };
    getWeather();
  }, []);

  if (loading) {
    return <WeatherCardSkeleton />;
  }

  return (
    <section className="col-span-1 row-span-1">
      <div className="bg-card relative mt-9 space-y-8 rounded-sm border border-gray-200 px-7 py-6">
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
        <hr />
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
