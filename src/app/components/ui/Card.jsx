'use client';
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openCard, closeCard } from '../../redux/slices/carouselSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import Image from 'next/image';

export const Card = ({ card, index }) => {
  const dispatch = useDispatch();
  const activeCardIndex = useSelector(
    (state) => state.carousel.activeCardIndex
  );
  const isActive = activeCardIndex === index;
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => dispatch(closeCard()));

  const handleOpen = () => {
    dispatch(openCard(index));
  };

  const handleClose = () => {
    dispatch(closeCard());
  };

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <div className='fixed inset-0 h-screen z-50 overflow-auto'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0'
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              className='max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[60] my-10 p-4 md:p-10 rounded-3xl relative'
            >
              <button
                className='absolute top-4 right-4 h-8 w-8 bg-black dark:bg-white rounded-full flex items-center justify-center'
                onClick={handleClose}
              >
                ✖
              </button>
              <p className='text-base font-medium text-black dark:text-white'>
                {card.category}
              </p>
              <p className='text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white'>
                {card.title}
              </p>
              <div className='py-10'>{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleOpen}
        className='rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-center relative z-10'
      >
        {/* Background Overlay */}
        <div className='absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none' />

        {/* Title Positioned at the Top */}
        <div className='relative z-40 p-4 md:p-6 flex flex-col items-center text-center w-full'>
          <p className='text-white text-xl md:text-3xl font-semibold animate-pulse'>
            {card.title}
          </p>
        </div>

        {/* Image */}
        <Image
          src={card.src ? card.src : '/default-placeholder.jpg'}
          alt={card.title || 'Default Title'}
          fill
          className='object-cover absolute z-10 inset-0'
        />
      </motion.button>
    </>
  );
};
