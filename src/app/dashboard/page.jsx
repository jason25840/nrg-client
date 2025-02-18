'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import ProfileSummary from './components/ProfileSummary';
import ConnectionGrid from './components/ConnectionGrid';
import { mockArticles } from '../data/mockData/articles';
import { mockEvents } from '../data/mockData/events';
import { mockGoals } from '../data/mockData/goals';
import { mockConnections } from '../data/mockData/connections';
import { motion } from 'framer-motion';

// Import missing components if needed
// import SavedArticles from './components/SavedArticles';
// import UpcomingEvents from './components/UpcomingEvents';
// import GoalsProjects from './components/GoalsProjects';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'succeeded' && user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, status, user]);

  if (status === 'loading') return <p>Loading authentication...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!user)
    return (
      <p className='text-black'>
        Please{' '}
        <Link href='/signin' className='text-primary-blue hover:underline'>
          Sign in
        </Link>{' '}
        to view your dashboard.
      </p>
    );

  return (
    <div className='container mx-auto p-6 grid gap-4 auto-rows-[minmax(200px,auto)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
      {/* Profile Summary - Fixed Width */}
      <motion.div
        className='md:col-span-1 bg-gray-100 dark:bg-neutral-800 text-black dark:text-white p-4 rounded-lg shadow-md'
        whileHover={{ scale: 1.02 }}
      >
        <ProfileSummary />
      </motion.div>

      {/* Saved Articles */}
      {mockArticles.length > 0 && (
        <motion.div
          className='md:col-span-2 lg:col-span-2 bg-white dark:bg-neutral-900 text-black dark:text-white p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Saved Articles
          </h3>
          <ul className='text-sm md:text-base'>
            {mockArticles.map((article, index) => (
              <li key={index}>
                {article.title} - {article.snippet}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Goals & Projects */}
      {mockGoals.length > 0 && (
        <motion.div
          className='md:col-span-1 lg:col-span-1 bg-gray-200 dark:bg-neutral-800 text-black dark:text-white p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Goals & Projects
          </h3>
          <ul className='text-sm md:text-base'>
            {mockGoals.map((goal, index) => (
              <li key={index}>
                {goal.goal} - {goal.progress}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Connections - Full Height */}
      {mockConnections.length > 0 && (
        <motion.div
          className='md:col-span-4 lg:col-span-4 bg-white dark:bg-neutral-900 text-black dark:text-white p-4 rounded-lg shadow-md h-full'
          whileHover={{ scale: 1.02 }}
        >
          <ConnectionGrid connections={mockConnections} />
        </motion.div>
      )}

      {/* Upcoming Events */}
      {mockEvents.length > 0 && (
        <motion.div
          className='md:col-span-3 lg:col-span-4 bg-gray-100 dark:bg-neutral-800 text-black dark:text-white p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            Upcoming Events
          </h3>
          <ul className='text-sm md:text-base'>
            {mockEvents.map((event, index) => (
              <li key={index}>
                {event.name} - {event.date}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
