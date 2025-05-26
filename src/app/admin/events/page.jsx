'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PageLayout from '../../components/ui/PageLayout';
import Button from '../../components/ui/Buttons';

export default function AdminEventsPage() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    router.push('/admin/events/edit');
  };

  const handleEdit = (eventId) => {
    router.push(`/admin/events/edit?id=${eventId}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <PageLayout>
      <div className='p-6'>
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold text-[--primary-blue]'>
              Manage Events
            </h2>
            <Button onClick={handleCreate}>➕ New Event</Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  className='p-4 border rounded-lg shadow hover:shadow-md transition'
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className='text-lg font-bold mb-2'>{event.title}</h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    {event.location} •{' '}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <div className='flex gap-3'>
                    <Button onClick={() => handleEdit(event._id)}>Edit</Button>
                    <Button
                      onClick={() => handleDelete(event._id)}
                      className='text-red-600 hover:underline'
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className='flex justify-end mt-4'>
            <Link
              href='/dashboard'
              className='bg-[--primary-green] hover:bg-[--accent-pink] text-white px-4 py-2 rounded-lg transition'
            >
              Return To dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
