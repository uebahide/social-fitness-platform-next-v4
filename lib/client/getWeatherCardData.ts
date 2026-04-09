export type DailyForecastItem = {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
};

type CurrentWeatherResponse = {
  current_weather: {
    weathercode: number;
    temperature: number;
  };
};

type LocationResponse = {
  address: {
    country?: string;
    city?: string;
    town?: string;
  };
};

type DailyForecastResponse = {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export type WeatherCardData = {
  weather: CurrentWeatherResponse["current_weather"];
  location: LocationResponse["address"];
  dailyForecast: DailyForecastItem[];
};

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
) {
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    { signal },
  );

  if (!weatherRes.ok) {
    throw new Error("Failed to fetch current weather.");
  }

  return (await weatherRes.json()) as CurrentWeatherResponse;
}

export async function fetchLocation(
  lat: number,
  lon: number,
  signal?: AbortSignal,
) {
  const locationRes = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`,
    { signal },
  );

  if (!locationRes.ok) {
    throw new Error("Failed to fetch location.");
  }

  return (await locationRes.json()) as LocationResponse;
}

export async function fetchDailyForecast(
  lat: number,
  lon: number,
  signal?: AbortSignal,
) {
  const dailyForecastRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`,
    { signal },
  );

  if (!dailyForecastRes.ok) {
    throw new Error("Failed to fetch daily forecast.");
  }

  return (await dailyForecastRes.json()) as DailyForecastResponse;
}

export async function getWeatherCardData(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherCardData> {
  const [weatherData, locationData, dailyForecastData] = await Promise.all([
    fetchCurrentWeather(lat, lon, signal),
    fetchLocation(lat, lon, signal),
    fetchDailyForecast(lat, lon, signal),
  ]);

  const mapped = dailyForecastData.daily.time.map(
    (date: string, index: number) => ({
      date: date.split("-")[2],
      weatherCode: dailyForecastData.daily.weather_code[index],
      max: dailyForecastData.daily.temperature_2m_max[index],
      min: dailyForecastData.daily.temperature_2m_min[index],
    }),
  );
  return {
    weather: weatherData.current_weather,
    location: locationData.address,
    dailyForecast: mapped,
  };
}
