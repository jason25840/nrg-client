'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

export default function ArticleCard({
  article,
  onClick,
  onLike,
  onBookmark,
  isAdmin,
  isFeatured,
}) {
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id;

  const likeCount = article.likes || 0;
  const likedUsers = article.likedBy || [];
  const hasLiked = likedUsers.some((user) => user._id === userId);
  const hasBookmarked = article.bookmarkedBy?.includes(userId);

  const [showLikedUsers, setShowLikedUsers] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: isFeatured ? 1.02 : 1.03 }}
      className={`relative rounded-xl overflow-visible shadow-md cursor-pointer transition-all contrast contrast-border`}
      onClick={onClick}
    >
      {/* ✅ Image Section */}
      <div className='relative w-full h-56'>
        <Image
          src={article.image}
          alt={article.title}
          width={400}
          height={250}
          className='w-full h-48 object-cover rounded-lg'
        />
      </div>

      {/* ✅ Article Content */}
      <div className='p-5'>
        <h2 className='text-xl font-semibold'>{article.title}</h2>
        <p className='text-sm'>
          {article.snippet.length > 100
            ? article.snippet.substring(0, 100) + '...'
            : article.snippet}
        </p>

        {/* ✅ Actions: Like, Bookmark, and Like List */}
        <div className='flex justify-between items-center mt-4'>
          {/* ✅ Like Button */}
          <button
            className='flex items-center gap-2 hover:text-red-500'
            onClick={(e) => onLike(e, article._id)}
          >
            {hasLiked ? (
              <FaHeart size={20} className='text-[--accent-pink]' />
            ) : (
              <FaRegHeart size={20} />
            )}
            <span>{likeCount}</span>
          </button>

          {/* ✅ Expandable Like List */}
          {likedUsers.length > 0 && (
            <div className='relative'>
              <button
                className='text-sm  flex items-center'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLikedUsers(!showLikedUsers);
                }}
              >
                {showLikedUsers ? (
                  <>
                    Hide Likes <FaChevronUp className='ml-1' />
                  </>
                ) : (
                  <>
                    {likedUsers.length}{' '}
                    {likedUsers.length === 1 ? 'Like' : 'Likes'}
                    <FaChevronDown className='ml-1' />
                  </>
                )}
              </button>

              {/* ✅ Liked Users Dropdown */}
              {showLikedUsers && (
                <div className='absolute contrast contrast-border p-3 mt-1 rounded-lg shadow-lg'>
                  <p className='text-sm font-semibold mb-2'>Liked by:</p>
                  {likedUsers.map((user, index) => (
                    <p key={index} className='text-sm text-black'>
                      {user?.name ?? user?.username ?? 'Anonymous'}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ✅ Bookmark Button */}
          <button
            className='flex items-center gap-2 hover:text-blue-500'
            onClick={(e) => onBookmark(e, article._id)}
          >
            {hasBookmarked ? (
              <FaBookmark size={20} className='text-[--accent-pink]' />
            ) : (
              <FaRegBookmark size={20} />
            )}
          </button>

          {/* ✅ Delete Button (Admin Only) */}
          {isAdmin && (
            <button className='hover:text-red-600'>
              <FaTrash size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
