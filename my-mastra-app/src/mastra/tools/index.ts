import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Interface for the response from the geocoding API.
interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
// Interface for the response from the weather API.
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

// Define the weather tool using createTool.
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location using US metrics (Fahrenheit, miles per hour)',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

// Function to fetch weather data for a given location.
const getWeather = async (location: string) => {
  // Construct the geocoding API URL.
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  // Check if the location was found.
  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`); // Throw error if location not found.
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  // Construct the weather API URL for US metrics.
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;
    // Extract weather data from the response.
  const {
    temperature_2m: temperatureCelsius,
    apparent_temperature: feelsLikeCelsius,
    relative_humidity_2m: humidity,
    wind_speed_10m: windSpeed,
    wind_gusts_10m: windGust,
    weather_code: weatherCode,
  } = data.current;

    // Return the formatted weather data.

  return {
    // Use Fahrenheit data directly
    temperature: temperatureCelsius,
    feelsLike: feelsLikeCelsius,
    humidity: humidity,
    windSpeed: windSpeed, // Already in mph
    windGust: windGust, // Already in mph
    conditions: getWeatherCondition(weatherCode),
    location: name,
  };
};

// Function to map the weather code to a human-readable condition.
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  // Return the weather condition or 'Unknown' if not found.
  return conditions[code] || 'Unknown';
}
