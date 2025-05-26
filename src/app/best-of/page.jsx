'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function BestOfPage() {
  const [topMessages, setTopMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/chat/top', {
          withCredentials: true,
        });
        setTopMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch top content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMessages();
  }, []);

  return (
    <div
      className='p-6 max-w-5xl mx-auto'
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <h1 className='text-3xl font-bold text-center mb-6 glow'>
        🔥 Best of the NRG
      </h1>
      {loading ? (
        <p className='text-center text-gray-300'>Loading top content...</p>
      ) : (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {topMessages.map((msg) => (
            <div
              key={msg._id}
              className='p-4 rounded shadow'
              style={{
                background: 'var(--background-dark)',
                borderColor: 'var(--primary-green)',
                borderWidth: 1,
              }}
            >
              <p
                className='text-sm font-semibold mb-2'
                style={{ color: 'var(--primary-blue)' }}
              >
                @{msg.senderUsername}
              </p>
              <p className='text-md mb-2'>{msg.text}</p>
              {msg.media && msg.media.endsWith('.mp4') ? (
                <video controls className='w-full rounded'>
                  <source src={msg.media} type='video/mp4' />
                </video>
              ) : (
                <img
                  src={msg.media}
                  alt='Top post'
                  className='w-full rounded'
                />
              )}
              <p
                className='text-xs mt-2'
                style={{ color: 'var(--accent-orange)' }}
              >
                🔥 Score: {msg.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
