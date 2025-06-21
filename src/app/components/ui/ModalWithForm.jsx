import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Buttons';
import { useCloseOnEscapeAndClick } from '../../hooks/useCloseOnEscapeAndClick';

export default function ModalWithForm({
  title,
  handleActiveModalClose = () => {},
  children,
  buttonText = 'Submit',
  onSubmit,
  asPage = false,
}) {
  const modalRef = useRef();

  useCloseOnEscapeAndClick(modalRef, handleActiveModalClose);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-[10000]'>
      <div className='relative w-96'>
        <div className='absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange shadow-xl animate-glow'></div>
        <div
          ref={modalRef}
          className='relative z-10 bg-background text-foreground p-8 rounded-lg shadow-2xl'
        >
          <button
            type='button'
            onClick={handleActiveModalClose}
            className='absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange shadow-lg transition-all hover:scale-110 focus:outline-none'
            aria-label='Close'
          >
            <X size={24} className='text-primary-blue drop-shadow-lg' />
          </button>

          <h2 className='text-center text-3xl font-bold mb-8'>{title}</h2>

          <form
            className='space-y-5 max-h-[70vh] overflow-y-auto pr-1'
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit && onSubmit(e);
            }}
          >
            {children}
            <Button type='submit' variant='primary' className='w-full'>
              {buttonText}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
