import React from 'react';

export default function SocialMediaLinks({ value, onChange }) {
  const handleChange = (platform, link) => {
    onChange({ ...value, [platform]: link });
  };

  return (
    <div className='social-media-links'>
      <label className='block text-lg font-semibold mb-2'>
        Social Media Links (Optional)
      </label>
      <input
        type='text'
        placeholder='Instagram'
        value={value.instagram}
        onChange={(e) => handleChange('instagram', e.target.value)}
        className='w-full p-2 border rounded-lg mb-2'
      />
      <input
        type='text'
        placeholder='TikTok'
        value={value.tiktok}
        onChange={(e) => handleChange('tiktok', e.target.value)}
        className='w-full p-2 border rounded-lg mb-2'
      />
      <input
        type='text'
        placeholder='Strava'
        value={value.strava}
        onChange={(e) => handleChange('strava', e.target.value)}
        className='w-full p-2 border rounded-lg mb-2'
      />
      <input
        type='text'
        placeholder='YouTube'
        value={value.youtube}
        onChange={(e) => handleChange('youtube', e.target.value)}
        className='w-full p-2 border rounded-lg'
      />
    </div>
  );
}
