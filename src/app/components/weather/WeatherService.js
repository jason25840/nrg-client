import axios from 'axios';

const API_KEY = '685e0a4492fbd6de829863e94a2f5d57';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherData(lat, lon) {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'imperial',
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching weather:', error.response?.data || error);
    return null;
  }
}
