'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signin } from '../../redux/slices/authSlice';
import ModalWithForm from '../ui/ModalWithForm';

export default function Signin({ handleActiveModalClose, setActiveModal }) {
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
      handleActiveModalClose();
    } else {
      alert(result.payload || 'Signin failed');
    }
  };

  return (
    <ModalWithForm
      title='Sign In'
      onSubmit={handleSubmit}
      handleActiveModalClose={handleActiveModalClose}
      buttonText='Sign In'
    >
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
      <div className='text-center mt-4'>
        Don&apos;t have an account?{' '}
        <span
          className='text-primary-blue cursor-pointer'
          onClick={() => {
            handleActiveModalClose(); // Close Sign In Modal
            setTimeout(() => setActiveModal('signup'), 100); // Open Sign Up Modal
          }}
        >
          Sign Up
        </span>
      </div>
    </ModalWithForm>
  );
}
