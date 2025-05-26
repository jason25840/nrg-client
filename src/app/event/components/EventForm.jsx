'use client';

import React, { useState, useEffect } from 'react';
import ModalWithForm from '../../components/ui/ModalWithForm';

export default function EventForm({
  onSubmit,
  handleActiveModalClose,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    date: initialData.date
      ? new Date(initialData.date).toISOString().substring(0, 10)
      : '',
    location: initialData.location || '',
    genre: initialData.genre || '',
    image: initialData.image || '',
    website: initialData.website || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description)
      newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    return newErrors;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData, initialData._id);
  };

  return (
    <ModalWithForm
      title={initialData._id ? 'Update Event' : 'Create New Event'}
      onSubmit={handleSubmitForm}
      handleActiveModalClose={handleActiveModalClose}
      buttonText={initialData._id ? 'Update Event' : 'Add Event'}
    >
      <input
        type='text'
        name='title'
        placeholder='Event Title'
        value={formData.title}
        onChange={handleChange}
        className={`border p-2 rounded w-full ${
          errors.title ? 'border-red-500' : ''
        }`}
      />
      {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}

      <textarea
        name='description'
        placeholder='Event Description'
        value={formData.description}
        onChange={handleChange}
        className={`border p-2 rounded w-full mt-2 ${
          errors.description ? 'border-red-500' : ''
        }`}
      />
      {errors.description && (
        <p className='text-red-500 text-sm'>{errors.description}</p>
      )}

      <input
        type='date'
        name='date'
        value={formData.date}
        onChange={handleChange}
        className={`border p-2 rounded w-full mt-2 ${
          errors.date ? 'border-red-500' : ''
        }`}
      />
      {errors.date && <p className='text-red-500 text-sm'>{errors.date}</p>}

      <input
        type='text'
        name='location'
        placeholder='Location'
        value={formData.location}
        onChange={handleChange}
        className={`border p-2 rounded w-full mt-2 ${
          errors.location ? 'border-red-500' : ''
        }`}
      />
      {errors.location && (
        <p className='text-red-500 text-sm'>{errors.location}</p>
      )}

      <input
        type='text'
        name='genre'
        placeholder='Genre'
        value={formData.genre}
        onChange={handleChange}
        className={`border p-2 rounded w-full mt-2 ${
          errors.genre ? 'border-red-500' : ''
        }`}
      />
      {errors.genre && <p className='text-red-500 text-sm'>{errors.genre}</p>}

      <input
        type='text'
        name='image'
        placeholder='Image URL (optional)'
        value={formData.image}
        onChange={handleChange}
        className='border p-2 rounded w-full mt-2'
      />
    </ModalWithForm>
  );
}
