'use client';

import React, { useState } from 'react';
import ModalWithForm from '../../components/ui/ModalWithForm';

export default function EventForm({ onSubmit, handleActiveModalClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    genre: '',
    image: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ModalWithForm
      title='Create New Event'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      handleActiveModalClose={handleActiveModalClose}
      buttonText='Add Event'
    >
      <input
        type='text'
        name='title'
        placeholder='Event Title'
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name='description'
        placeholder='Event Description'
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type='date'
        name='date'
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type='text'
        name='location'
        placeholder='Location'
        value={formData.location}
        onChange={handleChange}
        required
      />
      <input
        type='text'
        name='genre'
        placeholder='Genre'
        value={formData.genre}
        onChange={handleChange}
        required
      />
      <input
        type='text'
        name='image'
        placeholder='Image URL'
        value={formData.image}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}
