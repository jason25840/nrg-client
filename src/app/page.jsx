'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Button from '../app/components/ui/Buttons';
//import Signin from '../app/components/auth/Signin';
//import Signup from '../app/components/auth/Signup';
import WeatherCard from './components/weather/WeatherCard';
import { getWeatherData } from './components/weather/WeatherService';
import { Carousel } from './components/ui/Carousel';
import { Card } from './components/ui/Card';
import { carouselItems } from './data/carouselData';
import PageLayout from './components/ui/PageLayout';

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

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
    <PageLayout>
      <div className='relative flex flex-col w-full overflow-hidden'>
        {/* 🔹 Welcome Section */}
        <div className='relative z-20 w-full bg-gray-100 py-12 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-primary-blue mb-4'>
            Discover, Adventure, and Connect
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto mb-8'>
            NRG Lines is your gateway to find events, learn about the places,
            and connect with the New River Gorge outdoor community
          </p>
          <div className='mb-6'>
            <a
              href='/best-of'
              className='text-lg font-semibold text-primary-green hover:underline'
            >
              🔥 View the Best of NRG
            </a>
          </div>
          <Button
            onClick={
              () =>
                isAuthenticated
                  ? router.push('/dashboard')
                  : router.push('/signin?from=/') // 🟢 redirect with fallback info
            }
            variant='primary'
            className='animate-pulse'
          >
            {isAuthenticated
              ? 'Return to Dashboard'
              : 'Let the Adventure Begin'}
          </Button>
        </div>

        {/* 🔹 Carousel Section */}
        <div className='relative z-20 w-full bg-gray-100 py-12'>
          <div className='flex flex-col items-center justify-center w-full'>
            <Carousel
              items={carouselItems.map((item, index) => (
                <Card key={index} card={item} index={index} />
              ))}
            />
          </div>
        </div>

        {/* 🔹 Weather Section */}
        <div className='relative z-20 w-full bg-gray-100 py-12'>
          <div className='flex flex-col items-center justify-center w-full'>
            <h2 className='text-2xl md:text-3xl font-bold text-black mb-6'>
              NRG Weather Conditions
            </h2>
            {loading ? <p>Loading...</p> : <WeatherCard weather={weather} />}
          </div>
        </div>

        {/* ✅ Render Modals Conditionally 
        {activeModal === 'signin' && (
          <Signin
            handleActiveModalClose={handleActiveModalClose}
            setActiveModal={setActiveModal}
          />
        )}

        {activeModal === 'signup' && (
          <Signup handleActiveModalClose={handleActiveModalClose} />
        )}*/}
      </div>
    </PageLayout>
  );
}
