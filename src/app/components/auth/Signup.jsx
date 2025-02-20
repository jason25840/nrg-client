'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import ModalWithForm from '../ui/ModalWithForm';

export default function Signup({ handleActiveModalClose }) {
  console.log(handleActiveModalClose);
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
      handleActiveModalClose();
    } else {
      alert(result.payload || 'Signup failed');
    }
  };

  return (
    <ModalWithForm
      title='Sign Up'
      onSubmit={handleSubmit}
      handleActiveModalClose={handleActiveModalClose}
      buttonText='Sign Up'
    >
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
    </ModalWithForm>
  );
}
