import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccomplishments } from '../../redux/slices/profileSlice';

export default function AccomplishmentForm({ value }) {
  const [activityType, setActivityType] = useState('Climbing');
  const [accomplishments, setLocalAccomplishments] = useState([]);
  const [currentFields, setCurrentFields] = useState({});
  const dispatch = useDispatch();

  const activities = [
    'Climbing',
    'Mountain Biking',
    'Trail Running',
    'Kayaking',
  ];

  const handleFieldChange = (updatedFields) => {
    setCurrentFields((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleAddAccomplishment = () => {
    const newEntry = { type: activityType, ...currentFields };
    const updated = [...accomplishments, newEntry];
    setLocalAccomplishments(updated);
    dispatch(setAccomplishments(updated));
    setCurrentFields({});
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
              value={currentFields.routeName || ''}
              onChange={(e) => handleFieldChange({ routeName: e.target.value })}
            />
            <input
              type='text'
              placeholder='Difficulty Rating'
              className='w-full p-2 border rounded-lg mb-2'
              value={currentFields.difficultyRating || ''}
              onChange={(e) =>
                handleFieldChange({ difficultyRating: e.target.value })
              }
            />
            <select
              className='w-full p-2 border rounded-lg'
              value={currentFields.climbType || ''}
              onChange={(e) => handleFieldChange({ climbType: e.target.value })}
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
              value={currentFields.trailName || ''}
              onChange={(e) => handleFieldChange({ trailName: e.target.value })}
            />
            <input
              type='text'
              placeholder='Time'
              className='w-full p-2 border rounded-lg mb-2'
              value={currentFields.time || ''}
              onChange={(e) => handleFieldChange({ time: e.target.value })}
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
              value={currentFields.riverPaddled || ''}
              onChange={(e) =>
                handleFieldChange({ riverPaddled: e.target.value })
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
      <label
        className='block text-lg font-semibold mb-2'
        htmlFor='activity'
        title='Tell me about a recent accomplishment in and around the NRG'
      >
        Recent Lines
      </label>
      <select
        id='activity'
        value={activityType}
        onChange={(e) => {
          setActivityType(e.target.value);
          setCurrentFields({});
        }}
        className='w-full p-2 border rounded-lg'
      >
        {activities.map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
      {renderAccomplishmentFields()}
      <button
        type='button'
        onClick={handleAddAccomplishment}
        className='mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
      >
        Add Accomplishment
      </button>
    </div>
  );
}
