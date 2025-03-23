'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addEvent } from '../redux/slices/eventSlice';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEvents,
  likeEvent,
  bookmarkEvent,
} from '../redux/slices/eventSlice';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import EventForm from './components/EventForm';
import PageLayout from '../components/ui/PageLayout';

export default function EventsPage({ handleActiveModalClose }) {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Pagination State
  const [visibleEvents, setVisibleEvents] = useState(10);

  // ✅ Filter States
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleLike = (eventId) => {
    if (user) dispatch(likeEvent(eventId));
  };
  const handleBookmark = (eventId) => {
    if (user) dispatch(bookmarkEvent(eventId));
  };

  const handleSubmit = async (formData) => {
    console.log('Submitting event:', { ...formData, createdBy: user.id });

    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }

    try {
      const requestBody = { ...formData, createdBy: user.id }; // ✅ Ensure createdBy is included
      console.log('🔍 Request Body:', requestBody); // ✅ Log request data before sending

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
        requestBody, // ✅ Ensure createdBy is sent
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(addEvent(response.data)); // ✅ Update Redux
      console.log('✅ Event created:', response.data);

      handleActiveModalClose();
    } catch (error) {
      console.error(
        '❌ Error creating event:',
        error.response?.data || error.message
      );
    }
  };

  // ✅ Filter Function
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const monthMatch =
      !selectedMonth ||
      eventDate.toLocaleString('en-GB', { month: 'long' }) === selectedMonth;
    const locationMatch =
      !selectedLocation ||
      event.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const genreMatch =
      !selectedGenre ||
      event.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return monthMatch && locationMatch && genreMatch;
  });

  return (
    <PageLayout>
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-bold mb-6 text-center'>Upcoming Events</h1>

        {loading && <p>Loading events...</p>}
        {error && <p className='text-error'>{error}</p>}

        {/* ✅ Filters Section */}
        <div className='flex flex-wrap gap-4 mb-6 justify-center'>
          {/* Month Filter */}
          <select
            className='p-2 border rounded-md'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value=''>All Months</option>
            {Array.from(
              new Set(
                events.map((event) =>
                  new Date(event.date).toLocaleString('en-GB', {
                    month: 'long',
                  })
                )
              )
            ).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <input
            type='text'
            className='p-2 border rounded-md'
            placeholder='Search by Location'
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />

          {/* Genre Filter */}
          <select
            className='p-2 border rounded-md'
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value=''>All Genres</option>
            {Array.from(new Set(events.map((event) => event.genre))).map(
              (genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              )
            )}
          </select>
          <button onClick={() => setIsModalOpen(true)}>Add New Event</button>
          {isModalOpen && (
            <EventForm
              onSubmit={handleSubmit}
              handleActiveModalClose={() => setIsModalOpen(false)}
            />
          )}
        </div>

        {/* ✅ Events List (Limited to 10 at a time) */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredEvents.slice(0, visibleEvents).map((event) => (
            <div key={event._id} className='p-4 bg-white shadow-md rounded-lg'>
              <img
                src={event.image}
                alt={event.title}
                className='w-full h-48 object-cover rounded-md'
              />
              <h2 className='text-xl font-semibold mt-4'>{event.title}</h2>
              <p>
                {new Date(event.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p>{event.location}</p>
              <p className='text-sm'>{event.genre}</p>
              <p className='mt-2'>{event.description.substring(0, 100)}...</p>

              <div className='flex justify-between items-center mt-4'>
                <button
                  onClick={() => handleLike(event._id)}
                  className='flex items-center gap-2 hover:text-red'
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
                  className='flex items-center gap-2 hover:text-blue'
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

        {/* ✅ Load More Button */}
        {visibleEvents < filteredEvents.length && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={() => setVisibleEvents(visibleEvents + 10)}
              className='px-6 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-green'
            >
              Load More Events
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
