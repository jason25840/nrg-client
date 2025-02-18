import React from 'react';

export default function WeatherCard({ weather }) {
  if (!weather)
    return <p className='text-red-500'>Failed to load weather data.</p>;

  return (
    <div className='p-6 bg-primary-green text-black rounded-lg shadow-lg w-80'>
      <h2 className='text-2xl font-bold text-center mb-2'>{weather.name}</h2>
      <p className='text-lg text-center'>{weather.weather[0].description}</p>
      <div className='flex justify-between mt-4'>
        <p className='text-xl'>🌡️ {weather.main.temp}°F</p>
        <p className='text-xl'>💨 {weather.wind.speed} mph</p>
      </div>
    </div>
  );
}
