'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Buttons';
import { useCloseOnEscapeAndClick } from '../../../hooks/useCloseOnEscapeAndClick';

export default function ArticleCreate({ article, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '',
    image: '',
    content: '',
  });

  const modalRef = useRef();
  useCloseOnEscapeAndClick(modalRef, onClose);

  // Populate form fields if editing an article
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        category: article.category || '',
        author: article.author || '',
        image: article.image || '',
        content: article.content || '',
      });
    }
  }, [article]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (article) {
        await axios.put(`/api/articles/${article._id}`, formData);
      } else {
        await axios.post('/api/articles', formData);
      }
      onClose();
    } catch (error) {
      console.error('❌ Error saving article:', error);
      alert('Failed to save article.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className='bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-2xl'
      >
        <h2 className='text-2xl font-semibold mb-4'>
          {article ? 'Edit Article' : 'Create New Article'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            name='title'
            placeholder='Title'
            value={formData.title}
            onChange={handleChange}
            className='w-full border p-2 rounded-md'
          />

          <input
            name='category'
            placeholder='Category'
            value={formData.category}
            onChange={handleChange}
            className='w-full border p-2 rounded-md'
          />

          <input
            name='author'
            placeholder='Author'
            value={formData.author}
            onChange={handleChange}
            className='w-full border p-2 rounded-md'
          />

          <input
            name='image'
            placeholder='Image URL'
            value={formData.image}
            onChange={handleChange}
            className='w-full border p-2 rounded-md'
          />

          <textarea
            name='content'
            placeholder='Article content...'
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className='w-full border p-2 rounded-md'
          />

          <div className='flex justify-end gap-4'>
            <Button type='button' onClick={onClose} className='bg-gray-300'>
              Cancel
            </Button>
            <Button type='submit' className='bg-[--primary-green] text-white'>
              {article ? 'Update' : 'Create'} Article
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
