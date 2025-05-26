'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PageLayout from '../components/ui/PageLayout';
import ProfileSummary from './components/ProfileSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AdminPanel from './components/AdminPanel';
import EventCard from '../event/components/EventCard';
import ModalWithContent from '../components/ui/ModalWithContent';
import Image from 'next/image';

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);
  const { profile, status: profileStatus } = useSelector(
    (state) => state.profile
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?._id && profileStatus === 'idle') {
      dispatch(fetchProfile(user._id));
    }
  }, [dispatch, isAuthenticated, user, profileStatus]);

  if (status === 'loading' || profileStatus === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'failed' || profileStatus === 'failed') {
    return (
      <PageLayout>
        <p className='text-red-500 text-center mt-10'>
          Error: Failed to load profile
        </p>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <p className='text-foreground-light mt-40 text-center text-lg md:text-xl'>
          Please{' '}
          <Link
            href='/signin'
            className='text-primary-blue hover:underline hover:text-primary-green'
          >
            sign in
          </Link>{' '}
          to view your dashboard.
        </p>
      </PageLayout>
    );
  }

  const gravatarUrl =
    user?.avatar ||
    'https://media.istockphoto.com/id/2149530993/photo/digital-human-head-concept-for-ai-metaverse-and-facial-recognition-technology.webp?a=1&b=1&s=612x612&w=0&k=20&c=nyP4c-s5cSZy1nv1K0xn1ynC-Xuc1sY4Y29ZQqcrztA=';

  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto px-4 py-8 space-y-6'>
        {/* Avatar Display */}
        <div className='flex justify-center'>
          <div className='flex flex-col items-center'>
            <Image
              src={gravatarUrl}
              alt='User Avatar'
              width={120}
              height={120}
              className='rounded-full shadow-md border-4 border-primary-blue'
            />
            <p className='mt-2 text-lg font-semibold text-foreground'>
              {user?.name}
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <ProfileSummary profile={profile} />
        </motion.div>

        {/* Saved Articles */}
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            My Saved Articles
          </h3>
          <ul className='text-sm md:text-base'>
            {profile?.bookmarkedArticles?.length > 0 ? (
              profile.bookmarkedArticles.map((article, index) => (
                <li
                  key={index}
                  className='cursor-pointer text-primary-blue hover:text-primary-green transition duration-200'
                  onClick={() =>
                    router.push(`/article/${article._id}?from=/dashboard`)
                  }
                >
                  {article.title}
                </li>
              ))
            ) : (
              <p>
                No saved articles yet.{' '}
                <Link href='/article' className='text-primary-blue underline'>
                  Explore articles
                </Link>
              </p>
            )}
          </ul>
        </motion.div>

        {/* Projects */}
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>My Projects</h3>
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

        {/* Saved Events */}
        <motion.div
          className='bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg md:text-xl font-semibold mb-2'>
            My Saved Events
          </h3>
          {profile?.savedEvents?.length > 0 ? (
            <ul className='space-y-2'>
              {profile.savedEvents.map((event) => (
                <li
                  key={event._id}
                  className='cursor-pointer text-primary-blue hover:underline'
                  onClick={() =>
                    router.push(`/event/${event._id}?from=/dashboard`)
                  }
                >
                  {event.title} –{' '}
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No saved events yet.{' '}
              <Link href='/event' className='text-primary-blue underline'>
                Explore events
              </Link>
            </p>
          )}
        </motion.div>

        {/* Admin Panel */}
        {user?.role === 'admin' && <AdminPanel />}

        {/* EventCard Modal */}
        {selectedEvent && (
          <ModalWithContent onClose={() => setSelectedEvent(null)}>
            <EventCard event={selectedEvent} user={user} isOwner={false} />
          </ModalWithContent>
        )}
      </div>
    </PageLayout>
  );
}
