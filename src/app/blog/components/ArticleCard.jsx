'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IconHeart, IconBookmark, IconTrash } from '@tabler/icons-react';

export default function ArticleCard({ article }) {
  const router = useRouter();
  const placeholderImage =
    'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZXJyb3J8ZW58MHx8MHx8fDA%3D';

  if (!article) {
    return <p className='text-red-500'>Error: Article not found.</p>;
  }

  const snippetText = article.snippet
    ? article.snippet.length > 100
      ? article.snippet.substring(0, 100) + '...'
      : article.snippet
    : 'No description available.';

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className='rounded-xl bg-gray-100 dark:bg-neutral-900 overflow-hidden shadow-md cursor-pointer transition-all'
      onClick={() => router.push(`/blog/${article._id}`)}
    >
      {/* Image Section */}
      <div className='relative w-full h-56'>
        <Image
          src={
            article.image && article.image.trim() !== ''
              ? article.image
              : placeholderImage
          } // ✅ Uses fallback if no article image
          alt={article.title || 'Article Image'}
          width={400}
          height={250}
          className='w-full h-48 object-cover rounded-lg'
        />
      </div>

      {/* Title & Snippet */}
      <div className='p-5'>
        <h2 className='text-xl font-semibold text-foreground'>
          {article.title || 'Untitled Article'}
        </h2>
        <p className='text-sm text-foreground-light'>{snippetText}</p>

        {/* Actions */}
        <div className='flex justify-between items-center mt-4'>
          <button className='text-gray-500 hover:text-red-500'>
            <IconHeart size={20} />
          </button>
          <button className='text-gray-500 hover:text-blue-500'>
            <IconBookmark size={20} />
          </button>
          <button className='text-gray-500 hover:text-red-600'>
            <IconTrash size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
