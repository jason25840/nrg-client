'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function EventCard({
  event,
  user,
  onLike,
  onBookmark,
  onUpdate,
  onDelete,
  isOwner,
}) {
  console.log('🧾 EventCard received:', event);
  const router = useRouter();

  if (!event || !event.title) return null;

  const {
    _id,
    image,
    title,
    date,
    location,
    genre,
    website,
    description = '',
    likes = [],
    bookmarks = [],
  } = event;

  const getExcerpt = (text) =>
    typeof text === 'string' && text.length > 0
      ? `${text.substring(0, 100)}...`
      : 'No description';

  const handleNavigate = () => router.push(`/events/${_id}`);

  return (
    <div className='p-4 bg-white shadow-md rounded-lg'>
      <div className='cursor-pointer' onClick={handleNavigate}>
        <img
          src={image || '/images/NRG_Image_Placeholder.png'}
          alt={title}
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop
            e.target.src = '/images/NRG_Image_Placeholder.png';
          }}
          className='w-full h-48 object-cover rounded-md'
        />
        <h2 className='text-xl font-semibold mt-4'>{title}</h2>
        <p>
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p>{location}</p>
        <p className='text-sm italic'>{genre}</p>
        <p className='mt-2 text-sm'>{getExcerpt(description)}</p>
        <a
          href={website}
          target='_blank'
          rel='noopener noreferrer'
          className='text-[--primary-blue] underline mt-4 inline-block'
        >
          🔗 Visit Event Website
        </a>
      </div>

      <div className='flex justify-between items-center mt-4'>
        {isOwner && (
          <div className='flex justify-end gap-2 mt-4'>
            <button
              onClick={() => onUpdate?.(event)}
              className='text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600'
            >
              Update
            </button>
            <button
              onClick={() => onDelete?.(_id)}
              className='text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600'
            >
              Delete
            </button>
          </div>
        )}

        <button
          onClick={() => onLike?.('event', _id)}
          className='flex items-center gap-2 hover:text-red'
        >
          {Array.isArray(likes) && likes.includes(user?._id) ? (
            <FaHeart size={20} />
          ) : (
            <FaRegHeart size={20} />
          )}
          <span>{likes.length}</span>
        </button>

        <button
          onClick={() => onBookmark?.('event', _id)}
          className='flex items-center gap-2 hover:text-blue'
        >
          {Array.isArray(bookmarks) && bookmarks.includes(user?._id) ? (
            <FaBookmark size={20} />
          ) : (
            <FaRegBookmark size={20} />
          )}
          <span>{bookmarks.length}</span>
        </button>
      </div>
    </div>
  );
}
