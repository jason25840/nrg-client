import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccomplishments } from '../../redux/slices/profileSlice';

export default function AccomplishmentForm({ value }) {
  const [activityType, setActivityType] = useState('Climbing');
  const dispatch = useDispatch();

  const activities = [
    'Climbing',
    'Mountain Biking',
    'Trail Running',
    'Kayaking',
  ];

  const handleAccomplishmentChange = (updatedFields) => {
    const updatedAccomplishment = { type: activityType, ...updatedFields };
    dispatch(setAccomplishments([updatedAccomplishment])); // Dispatch updated accomplishment
  };

  const renderAccomplishmentFields = () => {
    switch (activityType) {
      case 'Climbing':
        return (
          <>
            <input
              type='text'
              placeholder='Route Name'
              className='w-full p-2 border rounded-lg mt-2 mb-2'
              onChange={(e) =>
                handleAccomplishmentChange({ routeName: e.target.value })
              }
            />
            <input
              type='text'
              placeholder='Difficulty Rating'
              className='w-full p-2 border rounded-lg mb-2'
              onChange={(e) =>
                handleAccomplishmentChange({ difficultyRating: e.target.value })
              }
            />
            <select
              className='w-full p-2 border rounded-lg'
              onChange={(e) =>
                handleAccomplishmentChange({ climbType: e.target.value })
              }
            >
              <option value='' disabled>
                Select Climbing Type
              </option>
              <option value='Sport'>Sport</option>
              <option value='Traditional'>Traditional</option>
              <option value='Top Rope'>Top Rope</option>
              <option value='Boulder'>Boulder</option>
            </select>
          </>
        );
      case 'Mountain Biking':
      case 'Trail Running':
        return (
          <>
            <input
              type='text'
              placeholder='Trail Name'
              className='w-full p-2 border rounded-lg mt-2 mb-2'
              onChange={(e) =>
                handleAccomplishmentChange({ trailName: e.target.value })
              }
            />
            <input
              type='text'
              placeholder='Time'
              className='w-full p-2 border rounded-lg mb-2'
              onChange={(e) =>
                handleAccomplishmentChange({ time: e.target.value })
              }
            />
          </>
        );
      case 'Kayaking':
        return (
          <>
            <input
              type='text'
              placeholder='River Paddled'
              className='w-full p-2 border rounded-lg mt-2 mb-2'
              onChange={(e) =>
                handleAccomplishmentChange({ riverPaddled: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='accomplishment-form'>
      <label className='block text-lg font-semibold mb-2' htmlFor='activity'>
        Activity Type
      </label>
      <select
        id='activity'
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
        className='w-full p-2 border rounded-lg'
      >
        {activities.map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
      {renderAccomplishmentFields()}
    </div>
  );
}
