'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ProfileSummary({ onEditProfile }) {
  const { profile, status, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!profile || !profile.pursuits || profile.pursuits.length === 0) {
    return (
      <div className='p-6 bg-gray-100 text-black rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>
          {user?.name
            ? `${user.name} has not created a profile yet.`
            : 'No Profile Found'}
        </h2>
        <p className='mb-10'>
          Start by adding your pursuits, accomplishments, and even social media
          links!
        </p>
        <button
          onClick={onEditProfile}
          className='btn bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 cursor-pointer'
        >
          Create Profile
        </button>
      </div>
    );
  }

  // ✅ Fix: Defaulting values if profile is missing properties
  const {
    pursuits = [],
    accomplishments = [],
    socialMediaLinks = {},
  } = profile || {};

  return (
    <div className='p-6 bg-gray-100 text-black rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>
        {profile?.user?.name
          ? `${profile.user.name}'s Profile`
          : 'Your Profile Summary'}
      </h2>

      {/* Pursuits */}
      <div className='mb-4'>
        <div className='relative group'>
          <h3 className='text-xl font-semibold inline-block'>Pursuits</h3>
          <button
            className='ml-2 text-blue-500 underline text-sm focus:outline-none'
            onClick={(e) => {
              e.currentTarget.nextSibling.classList.toggle('hidden');
            }}
          >
            What’s this?
          </button>
          <div className='absolute z-10 mt-2 p-2 text-sm bg-black text-white rounded shadow-lg hidden w-64'>
            These are activities or sports you pursue inside the NRG.
          </div>
        </div>
        {pursuits.length > 0 ? (
          <ul className='list-disc list-inside'>
            {pursuits.map((pursuit, index) => (
              <li key={index}>
                {pursuit.pursuit} - {pursuit.level}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pursuits added yet.</p>
        )}
      </div>

      {/* Accomplishments */}
      <div className='mb-4'>
        <h3 className='text-xl font-semibold'>Accomplishments</h3>
        {accomplishments.length > 0 ? (
          <ul className='list-disc list-inside'>
            {accomplishments.map((accomplishment, index) => (
              <li key={index}>
                {accomplishment.type}: {accomplishment.details}
              </li>
            ))}
          </ul>
        ) : (
          <p>No accomplishments added yet.</p>
        )}
      </div>

      {/* Social Media Links */}
      <div className='mb-4'>
        <h3 className='text-xl font-semibold'>Social Media</h3>
        {Object.values(socialMediaLinks).some((link) => link) ? (
          <ul className='list-disc list-inside'>
            {socialMediaLinks.instagram && (
              <li>
                <a
                  href={socialMediaLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  Instagram
                </a>
              </li>
            )}
            {socialMediaLinks.tiktok && (
              <li>
                <a
                  href={socialMediaLinks.tiktok}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  TikTok
                </a>
              </li>
            )}
            {socialMediaLinks.strava && (
              <li>
                <a
                  href={socialMediaLinks.strava}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  Strava
                </a>
              </li>
            )}
            {socialMediaLinks.youtube && (
              <li>
                <a
                  href={socialMediaLinks.youtube}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  YouTube
                </a>
              </li>
            )}
          </ul>
        ) : (
          <p>No social media links added yet.</p>
        )}
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={onEditProfile}
        className='btn bg-blue-500 text-white px-4 py-2 rounded-lg mt-4'
      >
        Edit Profile
      </button>
    </div>
  );
}
