'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import ModalWithForm from '../ui/ModalWithForm';
import { useFormValidation } from '../../hooks/validation/useFormValidation';
import { validateSignup } from '../../hooks/validation/validationRules';

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('from') || '/dashboard';

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit: handleValidationSubmit,
    setErrors,
  } = useFormValidation({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      password2: '',
    },
    validate: validateSignup,
    onSubmit: async () => {
      const result = await dispatch(signup(values));
      if (signup.fulfilled.match(result)) {
        router.push(redirectTo);
      } else if (signup.rejected.match(result)) {
        router.push(redirectTo);
      } else {
        setErrors({ form: result.payload || 'Signup failed' });
      }
    },
  });

  return (
    <ModalWithForm
      title='Sign Up'
      onSubmit={handleValidationSubmit}
      handleActiveModalClose={() => router.push('/')}
      buttonText='Sign Up'
      asPage={true}
      formError={errors.form}
    >
      <input
        type='text'
        name='name'
        placeholder='Full name: Optional'
        value={values.name || ''}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          touched?.name && errors?.name
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        } focus:ring-2`}
      />
      {errors.name && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>{errors.name}</p>
      )}

      <input
        type='text'
        name='username'
        placeholder='Username'
        value={values.username || ''}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          touched?.username && errors?.username
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        } focus:ring-2`}
      />
      {errors.username && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>
          {errors.username}
        </p>
      )}

      <input
        type='email'
        name='email'
        placeholder='Email'
        value={values.email || ''}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          touched?.email && errors?.email
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        } focus:ring-2`}
      />
      {errors.email && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>{errors.email}</p>
      )}

      <input
        type='password'
        name='password'
        placeholder='Password'
        value={values.password || ''}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          touched?.password && errors?.password
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        } focus:ring-2`}
      />
      {errors.password && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>
          {errors.password}
        </p>
      )}

      <input
        type='password'
        name='password2'
        placeholder='Confirm Password'
        value={values.password2 || ''}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          touched?.password2 && errors?.password2
            ? 'border-[var(--alert-red)] focus:ring-[var(--alert-red)]'
            : 'border-gray-300 focus:ring-primary-blue'
        } focus:ring-2`}
      />
      {errors.password2 && (
        <p className='text-[var(--alert-red)] text-sm mt-1'>
          {errors.password2}
        </p>
      )}

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
