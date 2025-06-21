'use client';

import React from 'react';
import { useFormValidation } from '../../hooks/validation/useFormValidation';
import { validateSignin } from '../../hooks/validation/validationRules';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signin } from '../../redux/slices/authSlice';
import ModalWithForm from '../ui/ModalWithForm';

export default function Signin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('from') || '/dashboard';
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  } = useFormValidation({
    initialValues: { email: '', password: '' },
    validate: validateSignin,
    onSubmit: async () => {
      const result = await dispatch(signin(values));
      if (signin.fulfilled.match(result)) {
        router.push(redirectTo);
      } else {
        setErrors({ general: result.payload || 'Signin failed' });
      }
    },
  });

  return (
    <ModalWithForm
      title='Sign In'
      onSubmit={handleSubmit}
      handleActiveModalClose={() => router.push('/')}
      buttonText='Sign In'
    >
      <input
        type='email'
        name='email'
        placeholder='Email'
        onChange={handleChange}
        onBlur={handleBlur}
        value={values?.email || ''}
        className={`w-full p-2 rounded-lg focus:ring-2 border ${
          touched.email && errors?.email
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        }`}
      />
      {touched.email && errors?.email && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>{errors.email}</p>
      )}
      <input
        type='password'
        name='password'
        placeholder='Password'
        onChange={handleChange}
        onBlur={handleBlur}
        value={values?.password || ''}
        className={`w-full p-2 rounded-lg focus:ring-2 border ${
          touched.password && errors?.password
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        }`}
      />
      {touched.password && errors?.password && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>
          {errors.password}
        </p>
      )}
      {errors.general && (
        <p className='text-[var(--alert-red)] text-sm mt-2'>{errors.general}</p>
      )}

      <div className='text-center mt-4 text-sm'>
        Don&apos;t have an account?{' '}
        <span
          className='text-primary-blue cursor-pointer font-semibold'
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </span>
      </div>
    </ModalWithForm>
  );
}
