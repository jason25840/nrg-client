'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import ProfileForm from './components/ProfileForm';
import useHasMounted from '@/app/hooks/useHasMounted'; // ✅ your hook

export default function ProfilePage() {
  const { profile } = useSelector((state) => state.profile);
  const hasMounted = useHasMounted(); // ✅ use it

  if (!hasMounted) return null; // ✅ fix hydration mismatch

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
