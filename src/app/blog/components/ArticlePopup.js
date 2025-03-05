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
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 rounded-full bg-primary-blue text-white shadow-lg transition-all hover:scale-110'
        >
          <X size={24} />
        </button>

        {/* Article Content */}
        <h2 className='text-4xl font-bold mb-4'>{article.title}</h2>
        <p className='text-sm text-gray-500'>{article.category}</p>

        {/* ✅ Image Section */}
        <div className='w-full h-80 mt-4 relative'>
          <Image
            src={article.image}
            alt={article.title}
            layout='fill'
            objectFit='cover'
            className='rounded-lg'
          />
        </div>

        {/* Article Text */}
        <p className='mt-6 text-lg leading-relaxed'>{article.content}</p>
      </motion.div>
    </div>
  );
}
