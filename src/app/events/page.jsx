import React from 'react';
import PageLayout from '../components/ui/PageLayout';

export default function Events() {
  return (
    <PageLayout>
      <div className='container mx-auto p-6'>
        <h1 className='text-5xl font-bold text-primary-blue mt-10 mb-6 text-center'>
          Events
        </h1>
        <p className='text-lg text-foreground-light text-center max-w-2xl mx-auto mb-10'>
          Find and join outdoor events in the New River Gorge area.
        </p>
        {/* Add event listings and features here */}
      </div>
    </PageLayout>
  );
}
