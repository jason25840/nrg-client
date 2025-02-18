'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function ProfileSummary() {
  const { profile, status, error } = useSelector((state) => state.profile);

  if (status === 'loading') {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return (
      <div className='p-6 bg-gray-100 text-black rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>No Profile Found</h2>
        <p className='mb-10'>
          You haven’t created a profile yet. Start by adding your pursuits,
          accomplishments, and even social media links!
        </p>
        <Link
          href='/profile'
          className='btn bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 cursor-pointer'
        >
          Create Profile
        </Link>
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
      <h2 className='text-2xl font-semibold mb-4'>Your Profile Summary</h2>

      {/* Pursuits */}
      <div className='mb-4'>
        <h3 className='text-xl font-semibold'>Pursuits</h3>
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
      <Link
        href='/profile'
        className='btn bg-blue-500 text-white px-4 py-2 rounded-lg mt-4'
      >
        Edit Profile
      </Link>
    </div>
  );
}
