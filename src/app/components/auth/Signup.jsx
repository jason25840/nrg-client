'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import ModalWithForm from '../ui/ModalWithForm';

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('from') || '/dashboard';

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password2: '', // ✅ match backend field name
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert('Passwords do not match!');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      alert(
        'Username must be 3–20 characters and contain only letters, numbers, or underscores.'
      );
      return;
    }

    const result = await dispatch(signup(formData));

    if (signup.fulfilled.match(result)) {
      router.push(redirectTo);
    } else {
      alert(result.payload || 'Signup failed');
    }
  };

  return (
    <ModalWithForm
      title='Sign Up'
      onSubmit={handleSubmit}
      handleActiveModalClose={() => router.push('/')}
      buttonText='Sign Up'
      asPage={true}
    >
      <input
        type='text'
        name='name'
        placeholder='Full name: Optional'
        value={formData.name}
        onChange={handleChange}
        className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
      />
      <input
        type='text'
        name='username'
        placeholder='Username'
        value={formData.username}
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
        name='password2'
        placeholder='Confirm Password'
        value={formData.password2}
        onChange={handleChange}
        className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue'
      />

      <div className='text-center mt-4 text-sm'>
        Already have an account?{' '}
        <span
          className='text-primary-blue cursor-pointer font-semibold'
          onClick={() => router.push(`/signin?from=${redirectTo}`)}
        >
          Sign In
        </span>
      </div>
    </ModalWithForm>
  );
}
