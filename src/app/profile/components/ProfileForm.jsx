'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PursuitSelector from './PursuitSelector';
import AccomplishmentForm from './AccomplishmentForm';
import SocialMediaLinks from './SocialMediaLinks';
import { updateProfile, createProfile } from '../../redux/slices/profileSlice';
import ModalWithForm from '../../components/ui/ModalWithForm';
import Button from '../../components/ui/Buttons';
import useHasMounted from '@/app/hooks/useHasMounted';
import { useCloseOnEscapeAndClick } from '@/app/hooks/useCloseOnEscapeAndClick';

export default function ProfileForm({ initialData, handleActiveModalClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(() => ({
    pursuits: initialData?.pursuits || [],
    accomplishments: initialData?.accomplishments || [],
    socialMediaLinks: initialData?.socialMediaLinks || {
      instagram: '',
      tiktok: '',
      strava: '',
      youtube: '',
    },
  }));

  const [showSocialMedia, setShowSocialMedia] = useState(false); // Toggle for optional section

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitting...', profileData);

    if (!user || !user._id) {
      console.error(
        'User is not authenticated. Cannot create or update profile.'
      );
      return;
    }

    // ✅ Client-side validation based on schema requirements
    if (
      !profileData.pursuits.length ||
      profileData.pursuits.some((p) => !p.pursuit || !p.level)
    ) {
      alert('Please add at least one pursuit with both name and level.');
      return;
    }

    // Accomplishments are now optional; no validation needed

    if (initialData) {
      // Update existing profile
      dispatch(
        updateProfile({
          pursuits: profileData.pursuits,
          accomplishments: profileData.accomplishments,
          socialMediaLinks: profileData.socialMediaLinks,
        })
      );
    } else {
      // Create new profile
      dispatch(
        createProfile({
          pursuits: profileData.pursuits,
          accomplishments: profileData.accomplishments,
          socialMediaLinks: profileData.socialMediaLinks,
        })
      );
    }

    if (handleActiveModalClose) {
      handleActiveModalClose(); // ✅ Only call if defined
    } // Close modal after submission
  };

  const hasMounted = useHasMounted();
  const modalRef = useRef();
  useCloseOnEscapeAndClick(modalRef, handleActiveModalClose);

  if (!hasMounted) return null;

  return (
    <ModalWithForm
      ref={modalRef}
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
      <label
        className='block text-lg font-semibold mt-6 mb-2'
        title='Optional – share a recent adventure if you like!'
      >
        Recent Lines
      </label>
      {profileData.accomplishments.map((item, index) => (
        <div
          key={index}
          className='relative border border-gray-300 p-4 mb-4 rounded-lg'
        >
          <AccomplishmentForm
            value={item}
            onChange={(updated) => {
              const updatedAccomplishments = [...profileData.accomplishments];
              updatedAccomplishments[index] = { ...item, ...updated };
              setProfileData({
                ...profileData,
                accomplishments: updatedAccomplishments,
              });
            }}
          />
          <Button
            variant='danger'
            onClick={() => {
              const updated = profileData.accomplishments.filter(
                (_, i) => i !== index
              );
              setProfileData({ ...profileData, accomplishments: updated });
            }}
            className='absolute top-2 right-2 text-xs'
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='secondary'
        className='mt-2 mb-6'
        disabled={
          profileData.accomplishments.length &&
          !profileData.accomplishments[profileData.accomplishments.length - 1]
            .type
        }
        onClick={() =>
          setProfileData({
            ...profileData,
            accomplishments: [
              ...profileData.accomplishments,
              { type: '', details: '' },
            ],
          })
        }
      >
        Add An Accomplishment
      </Button>

      {/* Social Media Links Toggle */}
      <div>
        <Button
          type='button'
          variant='primary'
          className='mt-4'
          onClick={() => setShowSocialMedia(!showSocialMedia)}
        >
          {showSocialMedia ? 'Remove Social Media Section' : 'Add Social Media'}
        </Button>
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
