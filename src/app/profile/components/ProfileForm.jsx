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
    projects: initialData?.projects || [],
    socialMediaLinks: initialData?.socialMediaLinks || {
      instagram: '',
      tiktok: '',
      strava: '',
      youtube: '',
    },
  }));

  const [showSocialMedia, setShowSocialMedia] = useState(false); // Toggle for optional section

  const handleSubmit = async (e) => {
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
      alert('Please add at least one pursuit with both name and skill level.');
      return;
    }

    const isEditing = initialData && initialData._id; // Ensure a real profile exists

    let result;
    if (isEditing) {
      result = await dispatch(
        updateProfile({
          userId: user._id,
          profileData: {
            pursuits: profileData.pursuits,
            accomplishments: profileData.accomplishments.filter(
              (a) => a.type.trim() !== '' && a.details.trim() !== ''
            ),
            projects: profileData.projects.filter(
              (p) => p.type.trim() !== '' && p.details.trim() !== ''
            ),
            socialMediaLinks: profileData.socialMediaLinks,
          },
        })
      );
    } else {
      result = await dispatch(
        createProfile({
          userId: user._id,
          profileData: {
            pursuits: profileData.pursuits,
            accomplishments: profileData.accomplishments.filter(
              (a) => a.type.trim() !== '' && a.details.trim() !== ''
            ),
            projects: profileData.projects.filter(
              (p) => p.type.trim() !== '' && p.details.trim() !== ''
            ),
            socialMediaLinks: profileData.socialMediaLinks,
          },
        })
      );
    }

    if (result.meta.requestStatus === 'fulfilled') {
      const modalElement = modalRef.current;
      if (modalElement && handleActiveModalClose) {
        modalElement.classList.add('animate-bounce-out');
        setTimeout(() => {
          handleActiveModalClose();
        }, 500); // delay to let animation finish
      } else if (handleActiveModalClose) {
        // Ensure modal closes even if ref is missing
        handleActiveModalClose();
      }
    }
  };

  const hasMounted = useHasMounted();
  const modalRef = useRef();
  useCloseOnEscapeAndClick(modalRef, handleActiveModalClose);

  if (!hasMounted) return null;

  return (
    <ModalWithForm
      modalRef={modalRef}
      title={initialData ? 'Edit Profile' : 'Create Profile'}
      onSubmit={handleSubmit}
      handleActiveModalClose={handleActiveModalClose}
      buttonText={initialData ? 'Update Profile' : 'Create Profile'}
      className='transition-all duration-500'
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
          (!profileData.accomplishments[
            profileData.accomplishments.length - 1
          ].type.trim() ||
            !profileData.accomplishments[
              profileData.accomplishments.length - 1
            ].details.trim())
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
        Add Another Accomplishment
      </Button>

      {/* Projects */}
      <label className='block text-lg font-semibold mt-6 mb-2'>
        Current Projects
      </label>
      {profileData.projects.map((item, index) => (
        <div
          key={index}
          className='relative border border-gray-300 p-4 mb-4 rounded-lg'
        >
          <AccomplishmentForm
            value={item}
            onChange={(updated) => {
              const updatedProjects = [...profileData.projects];
              updatedProjects[index] = { ...item, ...updated };
              setProfileData({
                ...profileData,
                projects: updatedProjects,
              });
            }}
          />
          <Button
            variant='danger'
            onClick={() => {
              const updated = profileData.projects.filter(
                (_, i) => i !== index
              );
              setProfileData({ ...profileData, projects: updated });
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
          profileData.projects.length &&
          (!profileData.projects[profileData.projects.length - 1].type.trim() ||
            !profileData.projects[
              profileData.projects.length - 1
            ].details.trim())
        }
        onClick={() =>
          setProfileData({
            ...profileData,
            projects: [...profileData.projects, { type: '', details: '' }],
          })
        }
      >
        Add Another Project
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
