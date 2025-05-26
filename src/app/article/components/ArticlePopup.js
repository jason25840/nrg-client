'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function ArticlePopup({ article, onClose }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[10000]'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='relative w-full max-w-4xl bg-background text-foreground p-8 rounded-lg shadow-2xl'
      >
        {/* ✅ Close Button - Ensures onClose works */}
        <button
          onClick={onClose} // ✅ Make sure this function exists and is passed
          className='absolute top-4 right-4 p-2 rounded-full bg-primary-blue text-black shadow-lg transition-all hover:scale-110 cursor-pointer'
        >
          <X size={24} />
        </button>

        {/* ✅ Article Content */}
        <h2 className='text-4xl font-bold mb-4'>{article.title}</h2>
        <p className='text-sm text-gray-500'>{article.category}</p>

        {/* ✅ Image Section */}
        <div className='w-full h-80 mt-4 relative'>
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              width={800}
              height={400}
              className='w-full h-auto rounded-lg object-cover'
            />
          ) : (
            <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg'>
              <p className='text-gray-500'>No image available</p>
            </div>
          )}
        </div>

        {/* ✅ Article Text */}
        <p className='mt-6 text-lg leading-relaxed'>{article.content}</p>
      </motion.div>
    </div>
  );
}
