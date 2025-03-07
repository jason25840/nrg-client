'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEvents,
  likeEvent,
  bookmarkEvent,
} from '../redux/slices/eventSlice';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import PageLayout from '../components/ui/PageLayout';

export default function EventsPage() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleLike = (eventId) => {
    if (user) dispatch(likeEvent(eventId));
  };
  const handleBookmark = (eventId) => {
    if (user) dispatch(bookmarkEvent(eventId));
  };

  return (
    <PageLayout>
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-bold mb-6 text-center'>Upcoming Events</h1>
        {loading && <p>Loading events...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {events.map((event) => (
            <div key={event._id} className='p-4 bg-white shadow-md rounded-lg'>
              <img
                src={event.image}
                alt={event.title}
                className='w-full h-48 object-cover rounded-md'
              />
              <h2 className='text-xl font-semibold mt-4'>{event.title}</h2>
              <p className='text-gray-600'>{event.date}</p>
              <p className='text-gray-800'>{event.location}</p>
              <p className='text-sm text-gray-600'>{event.genre}</p>
              <p className='mt-2'>{event.description.substring(0, 100)}...</p>
              <div className='flex justify-between items-center mt-4'>
                <button
                  onClick={() => handleLike(event._id)}
                  className='flex items-center gap-2 text-gray-500 hover:text-red-500'
                >
                  {event.likes.includes(user?._id) ? (
                    <FaHeart size={20} />
                  ) : (
                    <FaRegHeart size={20} />
                  )}
                  <span>{event.likes.length}</span>
                </button>
                <button
                  onClick={() => handleBookmark(event._id)}
                  className='flex items-center gap-2 text-gray-500 hover:text-blue-500'
                >
                  {event.bookmarks.includes(user?._id) ? (
                    <FaBookmark size={20} />
                  ) : (
                    <FaRegBookmark size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
