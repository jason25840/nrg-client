'use client';

import React, { useEffect, useState } from 'react';
import Button from '../app/components/ui/Buttons';
import Signin from '../app/components/auth/Signin';
import Signup from '../app/components/auth/Signup';
import WeatherCard from './components/weather/WeatherCard';
import { getWeatherData } from './components/weather/WeatherService';
import { Carousel } from './components/ui/Carousel';
import { Card } from './components/ui/Card';
import { carouselItems } from './data/carouselData';

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const handleActiveModalClose = () => setActiveModal(null);

  useEffect(() => {
    async function fetchWeather() {
      const response = await getWeatherData(38.0689, -81.0825);
      setWeather(response);
      setLoading(false);
    }
    fetchWeather();
  }, []);

  return (
    <div className='relative flex flex-col min-h-screen w-full overflow-hidden'>
      {/* 🔹 Hero Section */}
      <div className='relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden'>
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
          </video>
          <div className='absolute inset-0 bg-black/50'></div>
        </div>

        <h1 className='text-4xl md:text-5xl font-bold pb-10 lg:mb-20 md:mb-15 sm:mb-10 text-foreground z-10'>
          Welcome to the NRG Playground
        </h1>

        {/* ✅ Open Signin Modal */}
        <Button
          onClick={() => setActiveModal('signin')}
          variant='primary'
          className='z-10'
        >
          Go to Your Dashboard
        </Button>
      </div>

      {/* 🔹 Weather Section */}
      <div className='relative z-20 w-full bg-gray-100 py-8 md:py-12'>
        <div className='flex flex-col items-center justify-center w-full py-8 md:py-12'>
          <h2 className='text-2xl md:text-3xl font-bold text-black mb-10'>
            Current Weather in the Playground
          </h2>
          {loading ? <p>Loading...</p> : <WeatherCard weather={weather} />}
        </div>
      </div>

      {/* 🔹 Explore Section (Carousel) */}
      <div className='relative z-20 w-full bg-gray-100 py-8 md:py-12'>
        <div className='flex flex-col items-center justify-center w-full py-8 md:py-12'>
          <h2 className='text-2xl md:text-3xl font-bold text-black mb-6'>
            Explore the NRG
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

      {/* ✅ Render Modals Conditionally */}
      {activeModal === 'signin' && (
        <Signin
          handleActiveModalClose={handleActiveModalClose}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal === 'signup' && (
        <Signup handleActiveModalClose={handleActiveModalClose} />
      )}
    </div>
  );
}
