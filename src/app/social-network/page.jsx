'use client';

import React from 'react';
import { FocusCards } from '../components/ui/FocusCards';
import { FocusCardsData } from '../social-network/data';

export default function SocialNetworkPage() {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-6'>Connect with Others</h1>
      <FocusCards cards={FocusCardsData} />
    </div>
  );
}
