import React from 'react';

export default function ActivityCard({ activity, description }) {
  return (
    <div className='p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-green-500'>
      <h2 className='text-2xl text-white font-semibold mb-2'>{activity}</h2>
      <p className='text-white'>{description}</p>
    </div>
  );
}
