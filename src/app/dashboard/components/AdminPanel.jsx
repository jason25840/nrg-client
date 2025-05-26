'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function AdminPanel() {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') return null;

  return (
    <motion.div
      className='mt-6 bg-background-light text-foreground-light p-4 rounded-lg shadow-md'
      whileHover={{ scale: 1.02 }}
    >
      <h3 className='text-lg md:text-xl font-semibold mb-4'>Admin Panel</h3>
      <ul className='space-y-3 text-sm md:text-base'>
        <li>
          <Link
            href='/admin/articles'
            className='text-primary-blue hover:text-[--primary-green] transition'
          >
            ➕ Create or Manage Articles
          </Link>
        </li>
        <li>
          <Link
            href='/admin/events'
            className='text-primary-blue hover:text-[--primary-green] transition'
          >
            📅 Add or Edit Events
          </Link>
        </li>
        <li>
          <Link
            href='/admin/users'
            className='text-primary-blue hover:text-[--primary-green] transition'
          >
            👥 View All Users
          </Link>
        </li>
      </ul>
    </motion.div>
  );
}
