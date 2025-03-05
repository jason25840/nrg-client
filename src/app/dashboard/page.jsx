'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import Sidebar from '../components/ui/Sidebar';
import ProfileSummary from './components/ProfileSummary';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (status === 'succeeded' && user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, status, user]);

  if (status === 'loading') return <p>Loading authentication...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!user)
    return (
      <p className='text-foreground-light'>
        Please{' '}
        <Link href='/signin' className='text-primary-blue hover:underline'>
          Sign in
        </Link>{' '}
        to view your dashboard.
      </p>
    );

  return (
    <div className='flex'>
      {/* ✅ Use Updated Sidebar Component */}
      <Sidebar
        logo='/NRG_Playground_Logo.svg'
        links={[
          { label: 'Blog', href: '/blog', icon: 'IconArticle' },
          { label: 'Events', href: '/events', icon: 'IconCalendar' },
          { label: 'Adventure Map', href: '/adventure-map', icon: 'IconMap' },
          {
            label: 'Adventure Sports',
            href: '/adventure-sports',
            icon: 'IconUsers',
          },
        ]}
      />

      {/* ✅ Main Dashboard Content (Aligned with Sidebar) */}
      <div className='flex-1 transition-all duration-300 ease-in-out p-6 ml-16 md:ml-20 lg:ml-24'>
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <ProfileSummary profile={profile} />
        </motion.div>

        {/* ✅ Bookmarked Articles */}
        <motion.div
          className='mt-6 bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Bookmarked Articles
          </h3>
          <ul className='text-sm md:text-base'>
            {profile?.bookmarkedArticles?.length > 0 ? (
              profile.bookmarkedArticles.map((article, index) => (
                <li key={index}>{article.title}</li>
              ))
            ) : (
              <p>No bookmarked articles.</p>
            )}
          </ul>
        </motion.div>

        {/* ✅ Top Projects */}
        <motion.div className='mt-6 bg-background-light text-foreground-light p-4 rounded-lg shadow-md'>
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Top Projects
          </h3>
          <ul className='text-sm md:text-base'>
            {profile?.projects?.length > 0 ? (
              profile.projects.map((project, index) => (
                <li key={index}>
                  {project.name} - {project.description}
                </li>
              ))
            ) : (
              <p>
                No projects added yet.{' '}
                <Link
                  href='/add-project'
                  className='text-primary-blue underline'
                >
                  Add one now
                </Link>
              </p>
            )}
          </ul>
        </motion.div>

        {/* ✅ Saved Events */}
        <motion.div
          className='mt-6 bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Saved Events
          </h3>
          <ul className='text-sm md:text-base'>
            {profile?.savedEvents?.length > 0 ? (
              profile.savedEvents.map((event, index) => (
                <li key={index}>
                  {event.name} - {event.date}
                </li>
              ))
            ) : (
              <p>
                No saved events yet.{' '}
                <Link href='/events' className='text-primary-blue underline'>
                  Explore events
                </Link>
              </p>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
