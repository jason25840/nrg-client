'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatMessage from './ChatMessage';

export default function ChatInterface() {
  const user = useSelector((state) => state.auth.user); // No explicit type for state
  const [messages, setMessages] = useState([]); // Initialize messages as an empty array
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now().toString(), // Generate a unique ID for the message
        text: newMessage,
        userId: user.id,
        userName: user.name,
      };
      setMessages([...messages, message]); // Add the new message to the messages array
      setNewMessage(''); // Clear the input field
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-200px)]'>
      <div className='flex-grow overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg'>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            user={{ id: message.userId, name: message.userName }}
            isOwnMessage={user?.id === message.userId}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Type your message...'
          className='flex-grow p-2 border rounded-lg'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-lg'
        >
          Send
        </button>
      </form>
    </div>
  );
}
