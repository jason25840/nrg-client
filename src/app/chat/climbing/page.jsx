'use client';

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function ClimbingChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join the "climbing" chat room
    socket.emit('joinRoom', 'climbing');

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('message');
      socket.emit('leaveRoom', 'climbing');
    };
  }, []);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('sendMessage', { room: 'climbing', text: input });
      setInput('');
    }
  };

  return (
    <div className='flex flex-col h-full p-4'>
      <h1 className='text-2xl font-bold mb-4'>Climbing Chat</h1>

      <div className='flex-1 overflow-y-auto p-4 bg-gray-100 rounded mb-4'>
        {messages.map((msg, idx) => (
          <div key={idx} className='mb-2'>
            <span className='font-semibold'>{msg.user}:</span> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className='flex'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message...'
          className='flex-1 border border-gray-300 px-4 py-2 rounded-l'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600'
        >
          Send
        </button>
      </form>
    </div>
  );
}
