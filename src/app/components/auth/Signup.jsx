'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import Button from '../ui/Buttons';

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const result = await dispatch(signup(formData));
    if (signup.fulfilled.match(result)) {
      router.push('/dashboard');
    } else {
      alert(result.payload || 'Signup failed');
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-background text-foreground'>
      <div className='relative w-[24rem] p-6'>
        {/* Outer glowing animated border */}
        <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange animate-glow shadow-xl blur-md'></div>

        {/* Form Container */}
        <div className='relative bg-white text-gray-800 p-8 rounded-lg shadow-2xl border-2 border-transparent'>
          <h2 className='text-center text-3xl font-bold mb-6'>Sign Up</h2>

          <form className='space-y-4' onSubmit={handleSubmit}>
            <input
              type='text'
              name='name'
              placeholder='Name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <input
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
            />
            <Button
              type='submit'
              className='!text-foreground-light dark:!text-foreground-dark'
            >
              Sign Up
            </Button>
          </form>

          <button
            onClick={() => router.push('/signin')}
            className='mt-4 text-sm !text-foreground-light dark:!text-primary-blue w-full text-center'
          >
            Already have an account?{' '}
            <span className='!text-primary-blue dark:!text-accent-orange cursor-pointer'>
              Sign In
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
