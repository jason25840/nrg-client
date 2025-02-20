import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Buttons'; // ✅ Importing the reusable Button component

export default function ModalWithForm({
  title,
  handleActiveModalClose = () => {}, // Ensure it's always a function
  children,
  buttonText = 'Submit',
  onSubmit,
}) {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        handleActiveModalClose();
      }
    };
    window.addEventListener('keydown', handleEscClose);

    // ✅ Prevent Background Scroll When Modal is Open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscClose);
      document.body.style.overflow = 'auto';
    };
  }, [handleActiveModalClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleActiveModalClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleActiveModalClose]);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-[10000]'>
      {/* ✅ Outer Glowing Effect */}
      <div className='relative w-96'>
        <div className='absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange shadow-xl animate-glow'></div>

        {/* ✅ Form Container */}
        <div
          ref={modalRef}
          className='relative z-10 bg-background text-foreground p-8 rounded-lg shadow-2xl'
        >
          {/* ✅ Close Button - Glowing X */}
          <button
            type='button'
            onClick={handleActiveModalClose}
            className='absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange shadow-lg transition-all hover:scale-110 focus:outline-none'
            aria-label='Close'
          >
            <X size={24} className='text-primary-blue drop-shadow-lg' />
          </button>

          {/* ✅ Modal Title */}
          <h2 className='text-center text-3xl font-bold mb-8'>{title}</h2>

          <form className='space-y-5' onSubmit={onSubmit}>
            {children}

            {/* ✅ Submit Button - Uses Your Button Component */}
            <Button type='submit' variant='primary' className='w-full'>
              {buttonText}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
