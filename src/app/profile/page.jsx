'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import ProfileForm from './components/ProfileForm';

export default function ProfilePage() {
  const { profile } = useSelector((state) => state.profile);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-6'>Your Profile</h1>

      {profile ? (
        <ProfileForm initialData={profile} />
      ) : (
        <div>
          <p className='text-xl mb-4'>
            No profile found. Please create one to connect with others!
          </p>
          <ProfileForm initialData={null} />
        </div>
      )}
    </div>
  );
}
