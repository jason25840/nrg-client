'use client';

import React, { useState, useEffect } from 'react';
import WeatherCard from './weather/WeatherCard';
import { getWeatherData } from './weather/WeatherService';

export default function Landing() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const locations = [
    { name: 'Hinton', lat: 37.6749, lon: -80.8926 },
    { name: 'Grandview', lat: 37.8315, lon: -81.0625 },
    { name: 'Thurmond', lat: 37.9579, lon: -81.0782 },
    { name: 'Fayette Station', lat: 38.0615, lon: -81.0818 },
  ];

  useEffect(() => {
    async function fetchAllWeather() {
      const results = await Promise.all(
        locations.map(async (loc) => {
          const data = await getWeatherData(loc.lat, loc.lon);
          return { ...data, name: loc.name };
        })
      );
      setWeather(results);
      setLoading(false);
    }
    fetchAllWeather();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        weather.length > 0 ? (prevIndex + 1) % weather.length : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [weather]);

  return (
    <div className='relative w-full h-screen text-white bg-blue-900 flex flex-col items-center justify-center text-center px-6'>
      <video
        autoPlay
        muted
        loop
        playsInline
        className='absolute inset-0 w-full h-full object-cover z-0'
      >
        <source src='/your-video-file.mp4' type='video/mp4' />
      </video>
      <div className='absolute inset-0 bg-[--background-info-blue] z-5'></div>
      <div className='relative z-10 max-w-2xl bg-[--background-earth-light] p-6 rounded-xl backdrop-blur-md'>
        <h1 className='text-4xl md:text-5xl font-bold mb-6'>
          This site is for people who love the New River Gorge and want to
          connect, play, and build something together.
        </h1>
        <p className='text-lg mb-6'>
          If you’re technically minded or have design, writing, or video
          skills—let’s connect and make this app a reality. I’ll be working on
          it until we meet ⌨️
        </p>
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
          <a
            href='https://your-store-link.com'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-primary-green text-white font-semibold px-6 py-3 rounded hover:bg-green-400 transition'
          >
            Visit the Store
          </a>
          <a
            href='mailto:youremail@example.com'
            className='text-white underline hover:text-primary-green transition'
          >
            I Want to Help
          </a>
        </div>
      </div>
      <div className='relative z-10 mt-12 bg-[--background-earth-light] p-6 rounded-xl backdrop-blur-md'>
        <h2 className='text-xl font-semibold mb-4 text-center'>
          Current NRG Conditions
        </h2>
        {loading ? (
          <p className='text-center'>Loading weather...</p>
        ) : (
          <WeatherCard weather={weather[currentIndex]} />
        )}
      </div>
    </div>
  );
}
