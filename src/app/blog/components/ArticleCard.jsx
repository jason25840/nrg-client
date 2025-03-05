'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaTrash,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // ✅ Import toast for alerts
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import styles
import {
  toggleLikesModal,
  toggleLikeArticle,
} from '../../redux/slices/blogSlice';

export default function ArticleCard({ article, onClick, isAdmin }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const likesModalOpen = useSelector((state) => state.blog.likesModalOpen);
  const isExpanded = likesModalOpen === article._id;

  const currentUser = useSelector((state) => state.auth.user); // Assuming user is stored in Redux
  const userId = currentUser?._id; // Get logged-in user's ID

  const likeCount = article.likes || 0;
  const likedUsers = article.likedBy || [];

  // ✅ Check if the current user has already liked the article
  const hasLiked = likedUsers.some((user) => user._id === userId);

  const displayedUsers = likedUsers.slice(0, 2); // Show only the first two
  const moreUsers =
    likedUsers.length > 2 ? `+${likedUsers.length - 2} more` : '';

  // ✅ Handle Like Click
  const handleLike = (e) => {
    e.stopPropagation();

    if (!userId) {
      // ❌ User not signed in → Show alert with login link
      toast.warn(
        <div>
          <span>You must sign in to like articles. </span>
          <button
            onClick={() => router.push('/signin')}
            className='text-blue-500 underline ml-1'
          >
            Sign in now
          </button>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }

    dispatch(toggleLikeArticle(article._id)); // ✅ Dispatch Redux action if signed in
  };

  // ✅ Handle Like List Click (Show Full List)
  const handleToggleLikes = (e) => {
    e.stopPropagation();
    dispatch(toggleLikesModal(article._id));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className='rounded-xl bg-gray-100 dark:bg-neutral-900 overflow-hidden shadow-md cursor-pointer transition-all'
      onClick={onClick}
    >
      {/* Image Section */}
      <div className='relative w-full h-56'>
        <Image
          src={article.image}
          alt={article.title}
          width={400}
          height={250}
          className='w-full h-48 object-cover rounded-lg'
        />
      </div>

      {/* Title & Snippet */}
      <div className='p-5'>
        <h2 className='text-xl font-semibold text-foreground'>
          {article.title}
        </h2>
        <p className='text-sm text-foreground-light'>
          {article.snippet.length > 100
            ? article.snippet.substring(0, 100) + '...'
            : article.snippet}
        </p>

        {/* Actions */}
        <div className='flex justify-between items-center mt-4'>
          {/* ✅ Like Button (Toggles Between Filled & Outline Heart) */}
          <button
            className='flex items-center gap-2 text-gray-500 hover:text-red-500'
            onClick={handleLike}
          >
            {hasLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            <span>{likeCount}</span>
          </button>

          {/* ✅ Liked Users List */}
          <div className='text-sm text-gray-600 mt-2'>
            {displayedUsers.map((user) => (
              <span key={user._id} className='mr-1'>
                {user.username}
              </span>
            ))}
            {moreUsers && (
              <button className='text-blue-500' onClick={handleToggleLikes}>
                {isExpanded ? 'Hide' : moreUsers}
              </button>
            )}
          </div>

          {/* ✅ Bookmark Button */}
          <button className='flex items-center gap-2 text-gray-500 hover:text-blue-500'>
            <FaRegBookmark size={20} />
          </button>

          {/* ✅ Delete Button (Admin Only) */}
          {isAdmin && (
            <button className='text-gray-500 hover:text-red-600'>
              <FaTrash size={20} />
            </button>
          )}
        </div>

        {/* ✅ Full Liked Users List (Appears When Clicked) */}
        {isExpanded && (
          <div className='bg-white p-3 mt-2 rounded-lg shadow-lg border border-gray-300'>
            <p className='text-sm font-semibold mb-2'>Liked by:</p>
            {likedUsers.map((user) => (
              <p key={user._id} className='text-sm text-gray-700'>
                {user.username}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
