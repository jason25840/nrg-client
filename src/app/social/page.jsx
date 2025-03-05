'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signin, signup } from '../redux/slices/authSlice';
import PageLayout from '../components/ui/PageLayout';
import ChatInterface from './components/ChatInterface';

export default function SocialNetwork() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      dispatch(
        signin({ id: Date.now().toString(), name: username }) // Replace with actual login API logic if needed
      );
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className='max-w-md mx-auto mt-10'>
          <h1 className='text-5xl font-bold mb-4'>Join the Conversation</h1>
          <form onSubmit={handleLogin} className='space-y-4'>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your username'
              className='w-full p-2 border rounded-lg'
            />
            <button
              type='submit'
              className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg'
            >
              Join Chat
            </button>
          </form>
        </div>
      </PageLayout>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center my-4'>
        <h1 className='text-3xl font-bold'>Social Network</h1>
        <div>
          Welcome, {user.name}!{' '}
          <button
            onClick={() => dispatch(logout())}
            className='text-blue-500 underline'
          >
            Logout
          </button>
        </div>
      </div>
      <ChatInterface />
    </div>
  );
}
