'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import Sidebar from '../components/ui/Sidebar';
import ProfileSummary from './components/ProfileSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ArticlePopup from '../blog/components/ArticlePopup';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);
  const { profile, status: profileStatus } = useSelector(
    (state) => state.profile
  );
  const [selectedArticle, setSelectedArticle] = useState(null);

  console.log('📌 Dashboard State:', {
    isAuthenticated,
    user,
    profile,
    status,
    profileStatus,
  });

  // ✅ Fetch profile when user is authenticated and profile has not been loaded
  useEffect(() => {
    if (isAuthenticated && user?._id && profileStatus === 'idle') {
      console.log('🚀 Dispatching fetchProfile for user:', user._id);
      dispatch(fetchProfile(user._id));
    }
  }, [dispatch, isAuthenticated, user, profileStatus]);

  // ✅ Handle Loading States
  if (status === 'loading' || profileStatus === 'loading') {
    console.log('⏳ Still Loading Profile...');
    return <LoadingSpinner />;
  }

  if (status === 'failed' || profileStatus === 'failed') {
    return (
      <p className='text-red-500 text-center mt-10'>
        Error: Failed to load profile
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <p className='text-foreground-light mt-40 text-center text-lg md:text-160px'>
        Please{' '}
        <Link
          href='/signin'
          className='text-primary-blue hover:underline hover:text-primary-green cursor-pointer'
        >
          Sign in
        </Link>{' '}
        to view your dashboard.
      </p>
    );
  }

  return (
    <div className='flex'>
      <Sidebar />

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
                <li
                  key={index}
                  className='cursor-pointer text-primary-blue hover:text-[--primary-green] transition duration-200 ease-in-out hover:text-primary-green'
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.title}
                </li>
              ))
            ) : (
              <p>No bookmarked articles.</p>
            )}
          </ul>
        </motion.div>

        {/* ✅ Top Projects */}
        <motion.div
          className='mt-6 bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
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
                <Link
                  href='/eventsPage'
                  className='text-primary-blue underline'
                >
                  Explore events
                </Link>
              </p>
            )}
          </ul>
        </motion.div>
      </div>
      {selectedArticle && (
        <ArticlePopup
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
