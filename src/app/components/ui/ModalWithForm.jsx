import React, { useEffect, useRef } from 'react';

export default function ModalWithForm({
  title,
  handleActiveModalClose,
  children,
  buttonText = 'Submit',
  onSubmit,
}) {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') handleActiveModalClose();
    };
    window.addEventListener('keydown', handleEscClose);
    return () => window.removeEventListener('keydown', handleEscClose);
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
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70'>
      <div className='relative w-96'>
        {/* Outer glowing effect */}
        <div className='absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange shadow-xl animate-pulse'></div>

        {/* Form Container */}
        <div
          ref={modalRef}
          className='relative z-10 bg-background text-foreground p-8 rounded-lg shadow-2xl'
        >
          <h2 className='text-center text-3xl font-bold mb-8'>{title}</h2>

          <form className='space-y-5' onSubmit={onSubmit}>
            {children}
            <button
              type='submit'
              className='w-full bg-primary-green text-white font-bold rounded-lg py-2 hover:bg-primary-blue transition'
            >
              {buttonText}
            </button>
            <button
              type='button'
              onClick={handleActiveModalClose}
              className='mt-4 text-accent-pink hover:text-accent-orange text-center w-full'
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
