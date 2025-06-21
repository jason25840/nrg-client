'use client';

import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HamburgerMenu from './ui/HamburgerMenu';
import Button from './ui/Buttons';
import { signout } from '../redux/slices/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    { name: 'Join Chat', link: '/chat/general' },
    { name: 'Read Articles', link: '/article' },
    { name: 'See Events', link: '/event' },
    ...(isAuthenticated ? [{ name: 'My Dashboard', link: '/dashboard' }] : []),
  ].filter((item) => item.link !== pathname);

  const handleSignInClick = () => {
    router.push(`/signin?from=${pathname}`);
  };

  const handleSignout = async () => {
    const result = await dispatch(signout());

    if (signout.fulfilled.match(result)) {
      router.push('/');
    } else {
      console.error('Signout failed:', result);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 sm:py-4 md:py-5 z-[5000] transition-colors duration-300 ${
        scrolled ? 'backdrop-blur-md shadow-md' : ''
      }`}
    >
      {/*<div className='flex items-center'>*/}
      <div className='relative flex items-center justify-center'>
        <div className='absolute flex items-center justify-center'>
          <div className='w-[150px] h-[150px] md:w-[120px] md:h-[120px] max-sm:w-[80px] max-sm:h-[80px] rounded-full'></div>
        </div>

        <Link href='/' className='block'>
          <div className='relative w-[150px] h-[150px] md:w-[120px] md:h-[120px] max-sm:w-[80px] max-sm:h-[80px]'>
            <Image
              src='/NRGLines.png'
              alt='NRG Lines Logo'
              fill
              sizes='(max-width: 640px) 100px, (max-width: 1024px) 160px, 200px'
              className='object-contain'
              priority
            />
          </div>
        </Link>
      </div>
      {/*<div className='flex items-center justify-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-[--foreground-light] glow'>
            NRG LINES
          </h1>
        </div>
      </div>*/}

      {!isMobile ? (
        <div className='flex items-center gap-6'>
          <div className='relative inline-flex h-12 lg:h-14 md:h-10 overflow-hidden rounded-full px-6 py-2 border-[2px] border-transparent animate-border-glow shadow-md'>
            <span className='absolute inset-0 rounded-full border-[2px] border-transparent animate-border-glow' />
            <span className='relative z-10 flex items-center space-x-6 text-lg font-semibold text-[--foreground-light]'>
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

          {!isAuthenticated && pathname !== '/' ? (
            <Button onClick={handleSignInClick} variant='primary'>
              Sign In
            </Button>
          ) : isAuthenticated ? (
            <Button onClick={handleSignout} variant='primary'>
              Sign Out
            </Button>
          ) : null}
        </div>
      ) : (
        <HamburgerMenu navItems={navItems} />
      )}
    </motion.header>
  );
}
