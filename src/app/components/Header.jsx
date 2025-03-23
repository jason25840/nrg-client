'use client';

import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HamburgerMenu from './ui/HamburgerMenu';

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        setVisible(currentScrollY < lastScrollY || currentScrollY < 50);
        setScrolled(currentScrollY > 10);
        setLastScrollY(currentScrollY);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  const navItems = [
    { name: 'Be Social', link: '/social' },
    { name: 'Read Blog', link: '/blog' },
    { name: 'See Events', link: '/eventsPage' },
    ...(isAuthenticated ? [{ name: 'MyDashboard', link: '/dashboard' }] : []),
  ].filter((item) => item.link !== pathname);

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 z-[5000] transition-colors duration-300 
        ${
          scrolled
            ? 'bg-[rgba(248,249,250,0.9)] backdrop-blur-md shadow-md'
            : 'bg-[--background-light]'
        }`}
    >
      {/* Logo */}
      <div className='flex items-center'>
        <Link href='/'>
          <div className='relative flex items-center justify-center'>
            <div className='absolute flex items-center justify-center'>
              <div className='w-[200px] h-[200px] md:w-[160px] md:h-[160px] max-sm:w-[100px] max-sm:h-[100px] bg-[--accent-orange] rounded-full'></div>
            </div>

            <div className='relative w-[200px] h-[200px] md:w-[160px] md:h-[160px] max-sm:w-[100px] max-sm:h-[100px]'>
              <Image
                src='/NRGLogo2.svg'
                alt='NRG Connection Logo'
                fill
                sizes='(max-width: 640px) 100px, (max-width: 1024px) 160px, 200px'
                className='object-contain'
                priority
              />
            </div>
          </div>
        </Link>
      </div>

      {!isMobile && (
        <div className='relative inline-flex h-12 lg:h-14 md:h-10 overflow-hidden rounded-full px-10 lg:px-8 md:px-5 py-2 border-[2px] border-transparent animate-border-glow shadow-md'>
          <span className='absolute inset-0 rounded-full border-[2px] border-transparent animate-border-glow' />
          <span className='relative z-10 flex items-center space-x-6 lg:space-x-8 md:space-x-4 text-lg lg:text-xl md:text-sm font-semibold text-[--foreground-light]'>
            {navItems.map((navItem, idx) => (
              <Link
                key={idx}
                href={navItem.link}
                className='relative transition-all duration-300 hover:underline focus:underline'
              >
                {navItem.name}
              </Link>
            ))}
          </span>
        </div>
      )}

      {isMobile && <HamburgerMenu navItems={navItems} />}
    </motion.header>
  );
}
