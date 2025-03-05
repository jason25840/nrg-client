'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export const Card = ({ card }) => {
  return (
    <Link href={card.link} passHref>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className='group relative rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-center cursor-pointer shadow-lg transition-all duration-300'
      >
        {/* Background Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none' />

        {/* Title Positioned at the Top */}
        <div className='relative z-40 p-4 md:p-6 flex flex-col items-center text-center w-full'>
          <p className='text-white text-xl md:text-3xl font-semibold group-hover:scale-105 transition-all'>
            {card.title}
          </p>
        </div>

        {/* Image */}
        <Image
          src={card.src || '/default-placeholder.jpg'}
          alt={card.title || 'Default Title'}
          fill
          sizes='(max-width: 600px) 100px, (max-width: 1024px) 160px, 200px'
          className='object-cover absolute z-10 inset-0'
        />

        {/* Subtle Focus on Hover */}
        <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl' />
      </motion.div>
    </Link>
  );
};
