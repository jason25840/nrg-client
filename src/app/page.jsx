'use client';

// Landing-focused version of homepage — full app UI is preserved but temporarily disabled

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
import Landing from './components/Landing'; // 👈 New landing component

export default function Home() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleActiveModalClose = () => setActiveModal(null);

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
        weather && weather.length > 0 ? (prevIndex + 1) % weather.length : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [weather]);

  return (
    <PageLayout>
      {/*<Landing />

      💤 Original homepage UI preserved below — temporarily disabled for landing-focused version*/}

      <div className='relative flex flex-col w-full overflow-hidden'>
        <div className='relative z-20 w-full py-12'>
          <div className='flex flex-col items-center justify-center w-full'>
            <h2 className='text-2xl md:text-3xl font-bold text-black mb-6'>
              NRG Weather Conditions
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <WeatherCard weather={weather[currentIndex]} />
            )}
          </div>
        </div>

        <div className='relative z-20 w-full py-12 text-center'>
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
            onClick={() =>
              isAuthenticated
                ? router.push('/dashboard')
                : router.push('/signin?from=/')
            }
            variant='primary'
            className='animate-pulse'
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Signin'}
          </Button>
        </div>

        <div className='relative z-20 w-full py-12'>
          <div className='flex flex-col items-center justify-center w-full'>
            <Carousel
              items={carouselItems.map((item, index) => (
                <Card key={index} card={item} index={index} />
              ))}
            />
          </div>
        </div>

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
    </PageLayout>
  );
}
