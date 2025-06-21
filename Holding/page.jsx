'use client';

import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import { getWeatherData } from './WeatherService';

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getWeatherData(38.0689, -81.0825);
      setWeather(data);
      setLoading(false);
    }

    fetchWeather();
  }, []);

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground'>
      <h1 className='text-4xl font-bold mb-6'>New River Gorge Weather</h1>
      {loading ? (
        <p className='text-lg'>Loading weather data...</p>
      ) : (
        <WeatherCard weather={weather} />
      )}
    </div>
  );
}
