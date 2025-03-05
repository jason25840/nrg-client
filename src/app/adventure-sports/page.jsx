'use client';

import React from 'react';
import PageLayout from '../components/ui/PageLayout';
import { FocusCards } from './components/FocusCards';
import { FocusCardsData } from './data';

export default function AdventureSports() {
  return (
    <PageLayout>
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-bold text-primary-blue mt-10 mb-6 text-center'>
          Connect with Others
        </h1>
        <p className='text-lg text-foreground-light text-center max-w-2xl mx-auto mb-10'>
          Explore adventure sports communities, find local events, and match
          with fellow outdoor enthusiasts.
        </p>
        <div className='mb-20'>
          <FocusCards cards={FocusCardsData} />
        </div>
      </div>
    </PageLayout>
  );
}
