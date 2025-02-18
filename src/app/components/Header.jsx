'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Detect Scroll Direction (Show on Scroll Up, Hide on Scroll Down) & Background Transparency
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setVisible(false); // Hide when scrolling down
        } else {
          setVisible(true); // Show when scrolling up
        }

        setScrolled(currentScrollY > 10); // Make background visible after slight scroll
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Navigation Links
  const navItems = [
    { name: 'Be Social', link: '/social' },
    { name: 'Read Blog', link: '/blog' },
    { name: 'See Events', link: '/events' },
  ];

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-10 py-3 z-[5000] 
      ${
        scrolled ? 'bg-[rgba(0,0,0,0.15)] backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      {/* Left: Logo */}
      <div className='flex items-center'>
        <Link href='/'>
          <div className='relative w-[120px] h-[120px]'>
            <Image
              src='/NRGLogo.svg'
              alt='NRG Annex Logo'
              fill
              className='object-contain'
              priority
            />
          </div>
        </Link>
      </div>

      {/* Right: Navbar inside a glowing rounded container */}
      <div className='relative inline-flex h-12 overflow-hidden rounded-full px-6 py-2 border-[2px] border-transparent animate-border-glow shadow-md'>
        {/* Border Glow Effect */}
        <span className='absolute inset-0 rounded-full border-[2px] border-transparent animate-border-glow' />

        {/* Navigation Links */}
        <span className='relative z-10 flex items-center space-x-6 text-lg font-semibold'>
          {navItems.map((navItem, idx) => (
            <Link
              key={idx}
              href={navItem.link}
              className='relative text-foreground-light dark:text-foreground-dark transition-all duration-300 hover:underline focus:underline'
            >
              {navItem.name}
            </Link>
          ))}
        </span>
      </div>
    </motion.header>
  );
}
