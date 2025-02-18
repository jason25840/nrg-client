'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signin } from '../../redux/slices/authSlice';
import Button from '../ui/Buttons';

export default function Signin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signin(formData));
    if (signin.fulfilled.match(result)) {
      router.push('/dashboard');
    } else {
      alert(result.payload || 'Signin failed');
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-background text-foreground'>
      <div className='relative w-[24rem] p-6'>
        {/* Outer glowing animated border */}
        <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange animate-glow shadow-xl blur-md'></div>

        {/* Form Container */}
        <div className='relative bg-white text-gray-800 p-8 rounded-lg shadow-2xl border-2 border-transparent'>
          <h2 className='text-center text-3xl font-bold mb-6'>Sign In</h2>

          <form className='space-y-5' onSubmit={handleSubmit}>
            <input
              type='email'
              name='email'
              placeholder='Email'
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <Button
              type='submit'
              className='!text-foreground-light dark:!text-foreground-dark'
            >
              Sign In
            </Button>
          </form>

          <button
            onClick={() => router.push('/signup')}
            className='mt-4 text-sm !text-foreground-light dark:!text-primary-blue w-full text-center'
          >
            Don't have an account?{' '}
            <span className='!text-primary-blue dark:!text-accent-orange cursor-pointer'>
              Sign Up
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
