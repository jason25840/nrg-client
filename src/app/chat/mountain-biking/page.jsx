'use client';

import React from 'react';
import Link from 'next/link';

export default function ChatIndexPage() {
  const rooms = [
    { label: 'Climbing', path: 'climbing' },
    { label: 'Kayaking', path: 'kayaking' },
    { label: 'Mountain Biking', path: 'mountain-biking' },
  ];

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Chat Rooms</h1>
      <ul className='space-y-2'>
        {rooms.map((room) => (
          <li key={room.path}>
            <Link
              href={`/chat/${room.path}`}
              className='text-blue-600 hover:underline text-xl'
            >
              {room.label} Chat
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
