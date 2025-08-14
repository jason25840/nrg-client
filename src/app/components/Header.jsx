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
    if (!isAuthenticated) {
      router.push(`/signin?from=${pathname}`);
    } else {
      handleSignout();
    }
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
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-2 sm:py-3 md:py-4 z-[5000] transition-colors duration-300 ${
        scrolled ? 'backdrop-blur-md shadow-md' : ''
      }`}
    >
      {!isMobile ? (
        <div className='flex items-center w-full'>
          {/* Left: Logo */}
          <div className='flex-1 flex justify-start'>
            <Link href='/' className='block'>
              <div className='relative w-[200px] h-[80px] md:w-[240px] md:h-[100px] max-sm:w-[100px] max-sm:h-[40px]'>
                <Image
                  src='/NRGLines_FV.PNG'
                  alt='NRG Lines Logo'
                  fill
                  sizes='(max-width: 640px) 100px, (max-width: 1024px) 160px, 200px'
                  className='object-contain'
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center: Nav links */}
          <nav className='basis-1/3 md:basis-2/5 flex justify-center space-x-12 lg:space-x-10 md:space-x-6'>
            {navItems.map((navItem, idx) => (
              <Link
                key={idx}
                href={navItem.link}
                className='px-2 text-lg lg:text-lg md:text-base sm:text-sm font-semibold text-[--foreground-light] hover:text-[--accent-pink] transition-colors'
              >
                {navItem.name}
              </Link>
            ))}
          </nav>

          {/* Right: Auth button */}
          <div className='flex-1 flex justify-end pr-5 lg:pr-20'>
            <Button
              onClick={handleSignInClick}
              variant='primary'
              className='pr-5'
            >
              {!isAuthenticated ? 'Sign In' : 'Sign Out'}
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex items-center w-full px-2'>
          {/* Left: Logo */}
          <div className='flex-1 flex justify-start'>
            <Link href='/' className='block'>
              <div className='relative w-[100px] h-[30px]'>
                <Image
                  src='/NRGLines_FV.PNG'
                  alt='NRG Lines Logo'
                  fill
                  sizes='100px'
                  className='object-contain'
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right: Combined Hamburger + Sign In/Out */}
          <div className='flex-1 flex justify-end'>
            <HamburgerMenu
              navItems={[
                ...navItems,
                {
                  name: isAuthenticated ? 'Sign Out' : 'Sign In',
                  link: isAuthenticated ? '#' : `/signin?from=${pathname}`,
                  onClick: isAuthenticated ? handleSignout : undefined,
                },
              ]}
            />
          </div>
        </div>
      )}
    </motion.header>
  );
}
