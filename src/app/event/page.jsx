'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { addEvent } from '../redux/slices/eventSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useLikeBookmark } from '../hooks/useLikeBookmark';
import { fetchEvents } from '../redux/slices/eventSlice';
//import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import EventForm from './components/EventForm';
import EventCard from './components/EventCard';
import PageLayout from '../components/ui/PageLayout';

export default function EventPage() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Pagination State
  const [visibleEvents, setVisibleEvents] = useState(10);

  // ✅ Filter States
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { handleLike, handleBookmark } = useLikeBookmark();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    setVisibleEvents(10); // Reset pagination if needed
  }, [events]); // ✅ This ensures UI refreshes when Redux state changes

  const handleSubmit = async (formData) => {
    console.log('Submitting event:', { ...formData, createdBy: user._id });

    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }

    try {
      const requestBody = { ...formData, createdBy: user._id }; // ✅ Ensure createdBy is included
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

  const handleUpdate = async (eventId, updates) => {
    if (!user) {
      toast.error('You must be logged in to update an event.');
      return;
    }

    const event = events.find((e) => e._id === eventId);
    const isOwner = event.createdBy === user._id || user.role === 'admin';

    if (!isOwner) {
      toast.error('You can only update your own events.');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`,
        updates,
        { withCredentials: true }
      );
      toast.success('Event updated successfully!');
      dispatch(fetchEvents());
    } catch (error) {
      toast.error('Error updating event.');
      console.error(error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!user) {
      toast.error('You must be logged in to delete an event.');
      return;
    }

    const event = events.find((e) => e._id === eventId);
    const isOwner = event.createdBy === user._id || user.role === 'admin';

    if (!isOwner) {
      toast.error('You can only delete your own events.');
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`,
        { withCredentials: true }
      );
      toast.success('Event deleted!');
      dispatch(fetchEvents());
    } catch (error) {
      toast.error('Error deleting event.');
      console.error(error);
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
          <button
            onClick={() => {
              if (!user) {
                toast.error('You must be logged in to create an event.');
                return;
              }
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
          >
            Add New Event
          </button>
          {isModalOpen && (
            <EventForm
              onSubmit={(formData, eventId) => {
                if (eventId) {
                  handleUpdate(eventId, formData); // updating
                } else {
                  handleSubmit(formData); // creating
                }
                setIsModalOpen(false);
                setSelectedEvent(null); // reset after submit
              }}
              handleActiveModalClose={() => {
                setIsModalOpen(false);
                setSelectedEvent(null);
              }}
              initialData={selectedEvent || {}}
            />
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredEvents.slice(0, visibleEvents).map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onUpdate={(e) => {
                setSelectedEvent(e);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              isOwner={event.createdBy === user?._id || user?.role === 'admin'}
            />
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
