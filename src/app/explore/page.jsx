'use client';

import React from 'react';
import { Carousel } from '../components/ui/Carousel';
import { Card } from '../components/ui/Card';
import { carouselItems } from '../data/carouselData';

export default function Explore() {
  return (
    <div className='relative w-full flex flex-col items-center justify-center p-6'>
      {/* Page Header */}
      <h1 className='text-4xl font-bold text-foreground text-center mb-6'>
        Discover the NRG Annex
      </h1>
      <p className='text-lg text-center max-w-2xl text-foreground mb-10'>
        Connect with climbers, mountain bikers, trail runners, and kayakers in
        the New River Gorge. Explore activities, check weather conditions, and
        stay updated on upcoming events.
      </p>

      {/* Carousel Section */}
      <div className='w-full flex flex-col items-center justify-center'>
        <h2 className='text-3xl font-bold text-foreground mb-6'>
          Explore Activities
        </h2>
        <Carousel
          items={carouselItems.map((item, index) => (
            <Card key={index} card={item} index={index} />
          ))}
        />
      </div>
    </div>
  );
}
