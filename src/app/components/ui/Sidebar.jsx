import { useRouter } from 'next/navigation'; // ✅ Import useRouter
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '@/app/redux/slices/authSlice'; // ✅ Import signout action
import {
  IconArticle,
  IconCalendar,
  IconMap,
  IconUsers,
  IconLogout, // ✅ Import Logout Icon
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Initialize router

  const gravatarUrl =
    user?.avatar ||
    'https://media.istockphoto.com/id/2149530993/photo/digital-human-head-concept-for-ai-metaverse-and-facial-recognition-technology.webp?a=1&b=1&s=612x612&w=0&k=20&c=nyP4c-s5cSZy1nv1K0xn1ynC-Xuc1sY4Y29ZQqcrztA='; // Default avatar

  const links = [
    { label: 'Articles', href: '/article', icon: <IconArticle /> },
    { label: 'Events', href: '/events', icon: <IconCalendar /> },
    { label: 'Map', href: '/adventure-map', icon: <IconMap /> },
    { label: 'Connect', href: '/adventure-sports', icon: <IconUsers /> },
  ];

  const handleNavigation = (href) => {
    router.replace(href);
  };

  const handleSignout = () => {
    dispatch(signout()); // ✅ Dispatch signout action
    router.replace('/'); // ✅ Redirect to home after signing out
  };

  return (
    <motion.div
      className={cn(
        'fixed left-0 top-0 h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow-lg p-4 flex flex-col justify-between transition-all',
        isExpanded ? 'w-64' : 'w-16'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo (Links to Home) */}
      <div className='flex items-center justify-center mb-6'>
        <Link href='/'>
          <Image
            src='/NRGLogo2.svg'
            alt='Logo'
            width={isExpanded ? 120 : 40}
            height={40}
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className='flex flex-col space-y-4'>
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNavigation(link.href)}
            className='flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800'
          >
            {link.icon}
            {isExpanded && <span className='ml-2'>{link.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className='mt-auto flex flex-col'>
        {/* Profile Info */}
        <div className='flex items-center p-2'>
          <Image
            src={gravatarUrl}
            alt='User Avatar'
            width={40}
            height={40}
            className='rounded-full'
          />
          {isExpanded && (
            <span className='ml-3 font-semibold'>{user?.name || 'Guest'}</span>
          )}
        </div>

        {/* ✅ Sign Out Button */}
        <button
          onClick={handleSignout}
          className='flex items-center p-2 mt-4 rounded-md hover:bg-red-500 hover:text-white transition-all'
        >
          <IconLogout />
          {isExpanded && <span className='ml-2'>Sign Out</span>}
        </button>
      </div>
    </motion.div>
  );
}
