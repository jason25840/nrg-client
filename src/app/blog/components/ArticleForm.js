'use client';

import React, { useState } from 'react';
import ModalWithForm from '@/components/ui/ModalWithForm';

export default function ArticleForm({ onSubmit, handleActiveModalClose }) {
  const [formData, setFormData] = useState({
    title: '',
    snippet: '',
    content: '',
    image: '',
    author: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ModalWithForm
      title='Create New Article'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      handleActiveModalClose={handleActiveModalClose}
      buttonText='Publish Article'
    >
      <input
        type='text'
        name='title'
        placeholder='Title'
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name='snippet'
        placeholder='Short Snippet'
        value={formData.snippet}
        onChange={handleChange}
        required
      />
      <textarea
        name='content'
        placeholder='Full Article Content'
        value={formData.content}
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
      <input
        type='text'
        name='author'
        placeholder='Author'
        value={formData.author}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}
