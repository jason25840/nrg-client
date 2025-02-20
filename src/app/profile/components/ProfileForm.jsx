'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PursuitSelector from './PursuitSelector';
import AccomplishmentForm from './AccomplishmentForm';
import SocialMediaLinks from './SocialMediaLinks';
import { updateProfile, createProfile } from '../../redux/slices/profileSlice';
import ModalWithForm from '../ui/ModalWithForm';

export default function ProfileForm({ initialData, handleActiveModalClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(
    initialData || {
      pursuits: [],
      accomplishments: [],
      socialMediaLinks: {
        instagram: '',
        tiktok: '',
        strava: '',
        youtube: '',
      },
    }
  );

  const [showSocialMedia, setShowSocialMedia] = useState(false); // Toggle for optional section

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error(
        'User is not authenticated. Cannot create or update profile.'
      );
      return; // Exit the function early if user is not authenticated
    }

    if (initialData) {
      // Update existing profile
      dispatch(updateProfile({ userId: user.id, profileData }));
    } else {
      // Create new profile
      dispatch(createProfile({ userId: user.id, profileData }));
    }

    handleActiveModalClose(); // Close modal after submission
  };

  return (
    <ModalWithForm
      title={initialData ? 'Edit Profile' : 'Create Profile'}
      onSubmit={handleSubmit}
      handleActiveModalClose={handleActiveModalClose}
      buttonText={initialData ? 'Update Profile' : 'Create Profile'}
    >
      {/* Pursuit Selector */}
      <PursuitSelector
        value={profileData.pursuits}
        onChange={(value) =>
          setProfileData({ ...profileData, pursuits: value })
        }
      />

      {/* Accomplishments */}
      <AccomplishmentForm
        value={profileData.accomplishments}
        onChange={(value) =>
          setProfileData({ ...profileData, accomplishments: value })
        }
      />

      {/* Social Media Links Toggle */}
      <div>
        <button
          type='button'
          className='btn bg-gray-500 text-white px-4 py-2 rounded-lg'
          onClick={() => setShowSocialMedia(!showSocialMedia)}
        >
          {showSocialMedia ? 'Remove Social Media Section' : 'Add Social Media'}
        </button>
      </div>

      {/* Conditionally Render Social Media Section */}
      {showSocialMedia && (
        <SocialMediaLinks
          value={profileData.socialMediaLinks}
          onChange={(value) =>
            setProfileData({ ...profileData, socialMediaLinks: value })
          }
        />
      )}
    </ModalWithForm>
  );
}
