'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../app/components/ui/Buttons';
import WeatherCard from './components/weather/WeatherCard';
import { getWeatherData } from './components/weather/WeatherService';
import { Carousel } from './components/ui/Carousel';
import { Card } from './components/ui/Card';
import { carouselItems } from './data/carouselData';

export default function Home() {
  const router = useRouter();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getWeatherData(38.0689, -81.0825); // New River Gorge coords
      setWeather(data);
      setLoading(false);
    }
    fetchWeather();
  }, []);

  return (
    <div className='relative flex flex-col min-h-screen w-full overflow-hidden'>
      {/* 🔹 Hero Section with Video Background */}
      <div className='relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden'>
        {/* 🔹 Video Background (Full-Width) */}
        <div className='absolute inset-0 w-full h-full'>
          <video
            autoPlay
            loop
            muted
            className='absolute top-0 left-0 w-full h-full object-cover'
          >
            <source
              src='https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HrrabAxWinloumzm/videoblocks-senior-man-with-instructor-climbing-rocks-outdoors-in-nature-active-lifestyle_sbpp03txk__c06ba0f367cdd11a00f49c23b34bbeb8__P360.mp4'
              type='video/mp4'
            />
            Your browser does not support the video tag.
          </video>
          {/* 🔹 Dark Overlay for Readability */}
          <div className='absolute inset-0 bg-black/50'></div>
        </div>

        {/* 🔹 Hero Content */}
        <h1 className='text-5xl font-bold mb-40 text-foreground z-10'>
          Welcome to the NRG Annex
        </h1>
        <Button
          onClick={() => router.push('/signin')}
          variant='primary'
          className='z-10'
        >
          Go to Your Dashboard
        </Button>
      </div>

      {/* 🔹 BELOW HERO: Full-Width Sections Without Extra Margins */}
      <div className='relative z-20 w-full bg-gray-100 py-12'>
        {/* Weather Section */}
        <div className='flex flex-col items-center justify-center w-full py-12'>
          <h2 className='text-3xl font-bold text-black mb-6'>
            Current Weather in the NRG
          </h2>
          {loading ? (
            <p className='text-lg text-foreground'>Loading weather data...</p>
          ) : (
            <WeatherCard weather={weather} />
          )}
        </div>

        {/* Explore Section */}
        <div className='flex flex-col items-center justify-center w-full py-12'>
          <h2 className='text-3xl font-bold text-black mb-6'>
            Discover the NRG Annex
          </h2>
          <p className='text-lg text-center max-w-2xl text-black mb-10'>
            Connect with climbers, mountain bikers, trail runners, and kayakers
            in the New River Gorge. Explore activities, check weather
            conditions, and stay updated on upcoming events.
          </p>
          <div className='w-full flex flex-col items-center justify-center'>
            <Carousel
              items={carouselItems.map((item, index) => (
                <Card key={index} card={item} index={index} />
              ))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
