'use client';

import React, { useState } from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  createArticle,
  updateArticle,
} from '../../../redux/slices/articleSlice';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { toast } from 'react-toastify';

export default function ArticleModal({ isOpen, onClose, editingArticle }) {
  const modalRef = useRef(null);
  useOutsideClick(modalRef, onClose);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: editingArticle?.title || '',
    category: editingArticle?.category || '',
    content: editingArticle?.content || '',
    image: editingArticle?.image || '',
    author: editingArticle?.author || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const articlePayload = {
      ...formData,
      createdBy: user._id,
    };

    try {
      if (editingArticle) {
        await dispatch(
          updateArticle({ id: editingArticle._id, data: articlePayload })
        ).unwrap();
        toast.success('Article updated successfully!');
      } else {
        await dispatch(createArticle(articlePayload)).unwrap();
        toast.success('Article created successfully!');
      }
      onClose();
    } catch (err) {
      console.error('❌ Article submission error:', err);
      toast.error('Failed to submit article.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center'>
      <motion.div
        ref={modalRef}
        className='bg-white text-black p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className='text-xl font-semibold mb-4'>
          {editingArticle ? 'Edit Article' : 'New Article'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            name='title'
            placeholder='Title'
            value={formData.title}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border rounded'
          />

          <input
            type='text'
            name='category'
            placeholder='Category'
            value={formData.category}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border rounded'
          />

          <input
            type='text'
            name='author'
            placeholder='Author Name'
            value={formData.author}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded'
          />

          <input
            type='text'
            name='image'
            placeholder='Image URL (optional)'
            value={formData.image}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded'
          />

          <textarea
            name='content'
            placeholder='Article content'
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            className='w-full px-4 py-2 border rounded'
          />

          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[--primary-blue] text-white rounded hover:bg-[--primary-green]'
            >
              {editingArticle ? 'Update' : 'Create'} Article
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
