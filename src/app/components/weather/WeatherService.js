import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const ENABLE_WEATHER = true;

if (!ENABLE_WEATHER) {
  console.warn('Weather service is disabled');
}

const weatherCache = {};

export async function getWeatherData(lat, lon) {
  if (!ENABLE_WEATHER) return null;

  const cacheKey = `${lat},${lon}`;
  const cached = weatherCache[cacheKey];

  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return cached.data;
  }

  try {
    const res = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'imperial',
      },
    });

    if (res.data.cod === 429) {
      console.warn('Rate limit exceeded');
      return null;
    }

    weatherCache[cacheKey] = {
      data: res.data,
      timestamp: Date.now(),
    };

    return res.data;
  } catch (error) {
    console.error('Error fetching weather:', error.response?.data || error);
    return null;
  }
}
