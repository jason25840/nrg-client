import React from 'react';
import ActivityCard from './ActivityCard';

const activities = [
  { name: 'Climbing', description: 'Find climbing partners and events.' },
  { name: 'Mountain Biking', description: 'Connect with bikers in the area.' },
  { name: 'Trail Running', description: 'Meet trail runners in your area.' },
  { name: 'Kayaking', description: 'Discover kayaking opportunities.' },
];

export default function ConnectionGrid() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.name}
          activity={activity.name}
          description={activity.description}
          className='text-sm sm:text-base md:text-lg truncate' // Dynamic text sizing
        />
      ))}
    </div>
  );
}
