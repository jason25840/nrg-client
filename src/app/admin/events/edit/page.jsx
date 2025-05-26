'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import PageLayout from '../../../components/ui/PageLayout';
import Button from '../../../components/ui/Buttons';

export default function EventEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    genre: '',
    image: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/events/${eventId}`);
        const event = res.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date
            ? new Date(event.date).toISOString().substring(0, 10)
            : '',
          location: event.location || '',
          genre: event.genre || '',
          image: event.image || '',
        });
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventId) {
        await axios.put(`/api/events/${eventId}`, formData);
      } else {
        await axios.post('/api/events', formData);
      }
      router.push('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <PageLayout>
      <div className='max-w-2xl mx-auto p-6 bg-white rounded-xl shadow'>
        <h1 className='text-2xl font-bold mb-6'>
          {eventId ? 'Edit Event' : 'Create New Event'}
        </h1>

        {isLoading ? (
          <p className='text-gray-500'>Loading event data...</p>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'date', label: 'Date', type: 'date' },
              { name: 'location', label: 'Location', type: 'text' },
              { name: 'genre', label: 'Genre', type: 'text' },
              { name: 'image', label: 'Image URL', type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className='block text-sm font-medium mb-1'
                >
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                  />
                ) : (
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className='w-full p-2 border rounded'
                  />
                )}
              </div>
            ))}

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                onClick={() => router.back()}
                className='bg-gray-300'
              >
                Cancel
              </Button>
              <Button type='submit' className='bg-[--primary-green] text-white'>
                {eventId ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
