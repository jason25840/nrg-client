import React from 'react';

export default function PursuitSelector({ value, onChange }) {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const pursuits = ['Climbing', 'Mountain Biking', 'Trail Running', 'Kayaking'];

  const handlePursuitChange = (index, field, newValue) => {
    const updatedPursuits = [...value];
    updatedPursuits[index] = { ...updatedPursuits[index], [field]: newValue };
    onChange(updatedPursuits); // Pass the updated array back to the parent
  };

  const addPursuit = () => {
    onChange([...value, { pursuit: '', level: '' }]); // Add a new empty pursuit
  };

  const removePursuit = (index) => {
    const updatedPursuits = value.filter((_, i) => i !== index);
    onChange(updatedPursuits); // Update the array after removal
  };

  return (
    <div className='pursuit-selector space-y-4'>
      <label className='block text-lg font-semibold mb-2'>Your Pursuits</label>
      {value.map((item, index) => (
        <div key={index} className='flex space-x-4 items-center'>
          <select
            value={item.pursuit || ''}
            onChange={(e) =>
              handlePursuitChange(index, 'pursuit', e.target.value)
            }
            className='p-2 border rounded-lg w-1/2'
          >
            <option value='' disabled>
              Select pursuit
            </option>
            {pursuits.map((pursuit) => (
              <option key={pursuit} value={pursuit}>
                {pursuit}
              </option>
            ))}
          </select>
          <select
            value={item.level || ''}
            onChange={(e) =>
              handlePursuitChange(index, 'level', e.target.value)
            }
            className='p-2 border rounded-lg w-1/2'
          >
            <option value='' disabled>
              Select level
            </option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={() => removePursuit(index)}
            className='bg-red-500 text-white px-2 py-1 rounded-lg'
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={addPursuit}
        className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg'
      >
        Add Pursuit
      </button>
    </div>
  );
}
