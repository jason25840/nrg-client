'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import PageLayout from '../../components/ui/PageLayout';
import axios from 'axios';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const from = searchParams.get('from') || '/eventsPage';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${params.id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    if (params?.id) fetchEvent();
  }, [params?.id]);

  if (!event) return <p>Loading...</p>;

  return (
    <PageLayout>
      <div className='container mx-auto py-10 flex flex-col items-center text-center'>
        <button
          onClick={() => router.push(from)}
          className='text-[--ember-orange] hover:underline'
        >
          ← Go Back
        </button>

        <h1 className='text-4xl font-bold mt-4'>{event.title}</h1>
        <p className='text-gray-500 mt-2'>
          {event.genre} • {new Date(event.date).toLocaleDateString()}
        </p>

        <img
          src={event.image || '/images/placeholder.png'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.png';
          }}
          alt={event.title}
          className='w-full max-w-3xl h-96 object-cover rounded-xl mt-6'
        />

        <div className='mt-6 text-lg leading-relaxed text-foreground max-w-3xl'>
          <p className='mb-2'>
            <strong>Location:</strong> {event.location}
          </p>
          <p className='mb-2'>{event.description}</p>
          {event.website && (
            <a
              href={event.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[--primary-blue] underline mt-4 inline-block'
            >
              🔗 Visit Event Website
            </a>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
