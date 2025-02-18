'use client';
import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const FloatingNav = ({ navItems }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detect Scroll Direction (Show on Scroll Up, Hide on Scroll Down)
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setVisible(false); // Hide when scrolling down
        } else {
          setVisible(true); // Show when scrolling up
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence mode='wait'>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 flex max-w-fit items-center justify-center space-x-4 rounded-full border border-[var(--primary-green)] dark:border-[var(--primary-blue)] bg-[var(--background-light)] dark:bg-[var(--background-dark)] shadow-lg z-[9999] px-4 py-2'
          )}
        >
          {navItems.map((navItem, idx) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className='relative flex items-center space-x-2 text-[var(--foreground-light)] dark:text-[var(--foreground-dark)] hover:text-[var(--accent-orange)] dark:hover:text-[var(--primary-green)] text-sm md:text-base'
            >
              <span className='sm:hidden'>{navItem.icon}</span>
              <span className='hidden sm:block'>{navItem.name}</span>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
