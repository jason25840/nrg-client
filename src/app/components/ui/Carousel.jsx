'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { carouselItems } from '@/app/data/carouselData';

export const Carousel = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    checkScrollability();
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    checkScrollability();
  };

  return (
    <div className='relative w-full'>
      {/* Scrollable Carousel */}
      <div
        ref={carouselRef}
        className='flex w-full overflow-x-scroll py-10 md:py-20 scroll-smooth [scrollbar-width:none]'
        onScroll={checkScrollability}
      >
        <div className='flex flex-row justify-start gap-4 pl-4 max-w-7xl mx-auto'>
          {carouselItems.map((item, index) => (
            <motion.div
              key={`card${index}`}
              className='last:pr-[5%] md:last:pr-[33%]'
            >
              <Card card={item} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Buttons */}
      <div className='flex justify-end gap-2 mr-10'>
        <button
          className='h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center disabled:opacity-50'
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <IconArrowLeft className='h-6 w-6 text-[var(--foreground-light)] dark:text-[var(--foreground-dark)]' />
        </button>
        <button
          className='h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center disabled:opacity-50'
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <IconArrowRight className='h-6 w-6 text-[var(--foreground-light)] dark:text-[var(--foreground-dark)]' />
        </button>
      </div>
    </div>
  );
};
