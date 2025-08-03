'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { updateProfile } from '../../redux/slices/profileSlice';

export default function ProfileSummary() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  const {
    pursuits = [],
    accomplishments = [],
    socialMediaLinks = {},
    projects = [],
  } = profile || {};
  // Projects state and handlers
  const [editProjects, setEditProjects] = useState(false);
  const [projectsInput, setProjectsInput] = useState(
    projects.length > 0 ? projects : ['']
  );

  const handleProjectChange = (index, value) => {
    const updated = [...projectsInput];
    updated[index] = value;
    setProjectsInput(updated);
  };

  const addProjectField = () => {
    setProjectsInput([...projectsInput, '']);
  };

  const removeProjectField = (index) => {
    const updated = projectsInput.filter((_, i) => i !== index);
    setProjectsInput(updated.length > 0 ? updated : ['']);
  };

  const saveProjects = () => {
    dispatch(updateProfile({ ...profile, projects: projectsInput }));
    setEditProjects(false);
  };

  const [editPursuits, setEditPursuits] = useState(false);
  const [editAccomplishments, setEditAccomplishments] = useState(false);
  const [editSocialLinks, setEditSocialLinks] = useState(false);

  const [pursuitsInput, setPursuitsInput] = useState(
    pursuits.length > 0 ? pursuits : [{ pursuit: '', level: '' }]
  );
  const [accomplishmentsInput, setAccomplishmentsInput] = useState(
    accomplishments.length > 0 ? accomplishments : [{ type: '', details: '' }]
  );
  const [socialLinksInput, setSocialLinksInput] = useState({
    instagram: socialMediaLinks.instagram || '',
    tiktok: socialMediaLinks.tiktok || '',
    strava: socialMediaLinks.strava || '',
    youtube: socialMediaLinks.youtube || '',
  });

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
      </div>
    );
  }

  // Handlers for Pursuits editing
  const handlePursuitChange = (index, field, value) => {
    const updated = [...pursuitsInput];
    updated[index] = { ...updated[index], [field]: value };
    setPursuitsInput(updated);
  };

  const addPursuitField = () => {
    setPursuitsInput([...pursuitsInput, { pursuit: '', level: '' }]);
  };

  const removePursuitField = (index) => {
    const updated = pursuitsInput.filter((_, i) => i !== index);
    setPursuitsInput(
      updated.length > 0 ? updated : [{ pursuit: '', level: '' }]
    );
  };

  const savePursuits = () => {
    dispatch(
      updateProfile({
        userId: user._id,
        profileData: { ...profile, pursuits: pursuitsInput },
      })
    );
    setEditPursuits(false);
  };

  // Handlers for Accomplishments editing
  const handleAccomplishmentChange = (index, field, value) => {
    const updated = [...accomplishmentsInput];
    updated[index][field] = value;
    setAccomplishmentsInput(updated);
  };

  const addAccomplishmentField = () => {
    setAccomplishmentsInput([
      ...accomplishmentsInput,
      { type: '', details: '' },
    ]);
  };

  const removeAccomplishmentField = (index) => {
    const updated = accomplishmentsInput.filter((_, i) => i !== index);
    setAccomplishmentsInput(
      updated.length > 0 ? updated : [{ type: '', details: '' }]
    );
  };

  const saveAccomplishments = () => {
    dispatch(
      updateProfile({ ...profile, accomplishments: accomplishmentsInput })
    );
    setEditAccomplishments(false);
  };

  // Handlers for Social Media editing
  const handleSocialLinkChange = (platform, value) => {
    setSocialLinksInput((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const saveSocialLinks = () => {
    dispatch(updateProfile({ ...profile, socialMediaLinks: socialLinksInput }));
    setEditSocialLinks(false);
  };

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
            type='button'
          >
            What’s this?
          </button>
          <div className='absolute z-10 mt-2 p-2 text-sm bg-black text-white rounded shadow-lg hidden w-64'>
            These are activities or sports you pursue inside the NRG.
          </div>
          <button
            className='ml-4 bg-blue-500 text-white px-2 py-1 rounded text-sm'
            onClick={() => {
              setEditPursuits(!editPursuits);
              setPursuitsInput(
                pursuits.length > 0 ? pursuits : [{ pursuit: '', level: '' }]
              );
            }}
            type='button'
          >
            {editPursuits ? 'Cancel' : 'Add/Edit'}
          </button>
        </div>
        {editPursuits ? (
          <div className='mt-2'>
            {pursuitsInput.map((pursuit, index) => (
              <div key={index} className='flex items-center mb-2 space-x-2'>
                <select
                  value={pursuit.pursuit}
                  onChange={(e) =>
                    handlePursuitChange(index, 'pursuit', e.target.value)
                  }
                  className='border rounded px-2 py-1 flex-1'
                >
                  <option value=''>Select Pursuit</option>
                  <option value='Climbing'>Climbing</option>
                  <option value='Whitewater - Kayak'>Whitewater - Kayak</option>
                  <option value='Whitewater - Raft'>Whitewater - Raft</option>
                  <option value='Trail Running'>Trail Running</option>
                  <option value='Mountain Biking'>Mountain Biking</option>
                </select>
                <select
                  value={pursuit.level}
                  onChange={(e) =>
                    handlePursuitChange(index, 'level', e.target.value)
                  }
                  className='border rounded px-2 py-1 flex-1'
                >
                  <option value=''>Select Level</option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Intermediate'>Intermediate</option>
                  <option value='Advanced'>Advanced</option>
                  <option value='Expert'>Expert</option>
                </select>
                <button
                  type='button'
                  onClick={() => removePursuitField(index)}
                  className='text-red-500 font-bold px-2'
                  aria-label='Remove pursuit'
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addPursuitField}
              className='bg-green-500 text-white px-3 py-1 rounded mb-2'
            >
              Add Pursuit
            </button>
            <div>
              <button
                type='button'
                onClick={savePursuits}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Save
              </button>
              <button
                type='button'
                onClick={() => setEditPursuits(false)}
                className='bg-gray-300 text-black px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : pursuits.length > 0 ? (
          <ul className='list-disc list-inside mt-2'>
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

      {/* Projects */}
      <div className='mb-4'>
        <div className='flex items-center'>
          <h3 className='text-xl font-semibold flex-1'>Projects</h3>
          <button
            className='bg-blue-500 text-white px-2 py-1 rounded text-sm'
            onClick={() => {
              setEditProjects(!editProjects);
              setProjectsInput(projects.length > 0 ? projects : ['']);
            }}
            type='button'
          >
            {editProjects ? 'Cancel' : 'Add/Edit'}
          </button>
        </div>
        {editProjects ? (
          <div className='mt-2'>
            {projectsInput.map((project, index) => (
              <div key={index} className='flex items-center mb-2 space-x-2'>
                <input
                  type='text'
                  placeholder='Project Name'
                  value={project}
                  onChange={(e) => handleProjectChange(index, e.target.value)}
                  className='border rounded px-2 py-1 flex-1'
                />
                <button
                  type='button'
                  onClick={() => removeProjectField(index)}
                  className='text-red-500 font-bold px-2'
                  aria-label='Remove project'
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addProjectField}
              className='bg-green-500 text-white px-3 py-1 rounded mb-2'
            >
              Add Project
            </button>
            <div>
              <button
                type='button'
                onClick={saveProjects}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Save
              </button>
              <button
                type='button'
                onClick={() => setEditProjects(false)}
                className='bg-gray-300 text-black px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <ul className='list-disc list-inside mt-2'>
            {projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        ) : (
          <p>No projects added yet.</p>
        )}
      </div>

      {/* Accomplishments */}
      <div className='mb-4'>
        <div className='flex items-center'>
          <h3 className='text-xl font-semibold inline-block flex-1'>
            Accomplishments
          </h3>
          <button
            className='bg-blue-500 text-white px-2 py-1 rounded text-sm'
            onClick={() => {
              setEditAccomplishments(!editAccomplishments);
              setAccomplishmentsInput(
                accomplishments.length > 0
                  ? accomplishments
                  : [{ type: '', details: '' }]
              );
            }}
            type='button'
          >
            {editAccomplishments ? 'Cancel' : 'Add/Edit'}
          </button>
        </div>
        {editAccomplishments ? (
          <div className='mt-2'>
            {accomplishmentsInput.map((accomplishment, index) => (
              <div key={index} className='flex items-center mb-2 space-x-2'>
                <input
                  type='text'
                  placeholder='Type'
                  value={accomplishment.type}
                  onChange={(e) =>
                    handleAccomplishmentChange(index, 'type', e.target.value)
                  }
                  className='border rounded px-2 py-1 flex-1'
                />
                <input
                  type='text'
                  placeholder='Details'
                  value={accomplishment.details}
                  onChange={(e) =>
                    handleAccomplishmentChange(index, 'details', e.target.value)
                  }
                  className='border rounded px-2 py-1 flex-1'
                />
                <button
                  type='button'
                  onClick={() => removeAccomplishmentField(index)}
                  className='text-red-500 font-bold px-2'
                  aria-label='Remove accomplishment'
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addAccomplishmentField}
              className='bg-green-500 text-white px-3 py-1 rounded mb-2'
            >
              Add Accomplishment
            </button>
            <div>
              <button
                type='button'
                onClick={saveAccomplishments}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Save
              </button>
              <button
                type='button'
                onClick={() => setEditAccomplishments(false)}
                className='bg-gray-300 text-black px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : accomplishments.length > 0 ? (
          <ul className='list-disc list-inside mt-2'>
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
        <div className='flex items-center'>
          <h3 className='text-xl font-semibold flex-1'>Social Media</h3>
          <button
            className='bg-blue-500 text-white px-2 py-1 rounded text-sm'
            onClick={() => {
              setEditSocialLinks(!editSocialLinks);
              setSocialLinksInput({
                instagram: socialMediaLinks.instagram || '',
                tiktok: socialMediaLinks.tiktok || '',
                strava: socialMediaLinks.strava || '',
                youtube: socialMediaLinks.youtube || '',
              });
            }}
            type='button'
          >
            {editSocialLinks ? 'Cancel' : 'Add/Edit'}
          </button>
        </div>
        {editSocialLinks ? (
          <div className='mt-2 space-y-2'>
            <div>
              <label htmlFor='instagram' className='block font-semibold'>
                Instagram
              </label>
              <input
                id='instagram'
                type='url'
                placeholder='Instagram URL'
                value={socialLinksInput.instagram}
                onChange={(e) =>
                  handleSocialLinkChange('instagram', e.target.value)
                }
                className='border rounded px-2 py-1 w-full'
              />
            </div>
            <div>
              <label htmlFor='tiktok' className='block font-semibold'>
                TikTok
              </label>
              <input
                id='tiktok'
                type='url'
                placeholder='TikTok URL'
                value={socialLinksInput.tiktok}
                onChange={(e) =>
                  handleSocialLinkChange('tiktok', e.target.value)
                }
                className='border rounded px-2 py-1 w-full'
              />
            </div>
            <div>
              <label htmlFor='strava' className='block font-semibold'>
                Strava
              </label>
              <input
                id='strava'
                type='url'
                placeholder='Strava URL'
                value={socialLinksInput.strava}
                onChange={(e) =>
                  handleSocialLinkChange('strava', e.target.value)
                }
                className='border rounded px-2 py-1 w-full'
              />
            </div>
            <div>
              <label htmlFor='youtube' className='block font-semibold'>
                YouTube
              </label>
              <input
                id='youtube'
                type='url'
                placeholder='YouTube URL'
                value={socialLinksInput.youtube}
                onChange={(e) =>
                  handleSocialLinkChange('youtube', e.target.value)
                }
                className='border rounded px-2 py-1 w-full'
              />
            </div>
            <div className='mt-2'>
              <button
                type='button'
                onClick={saveSocialLinks}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Save
              </button>
              <button
                type='button'
                onClick={() => setEditSocialLinks(false)}
                className='bg-gray-300 text-black px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : Object.values(socialMediaLinks).some((link) => link) ? (
          <ul className='list-disc list-inside mt-2'>
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
    </div>
  );
}
