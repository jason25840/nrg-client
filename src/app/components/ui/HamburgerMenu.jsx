'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function HamburgerMenu({ navItems }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='relative z-50'>
      {/* Hamburger Icon */}
      <button
        className='text-foreground-light dark:text-foreground-dark p-2'
        onClick={() => setOpen(!open)}
        aria-label='Toggle navigation'
      >
        {open ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Dropdown Menu with Glow Effect */}
      {open && (
        <div className='absolute top-12 right-0 w-48'>
          {/* 🔹 Background Glow Effect */}
          <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-primary-blue via-primary-green to-accent-orange animate-glow shadow-xl blur-md'></div>

          {/* 🔹 Navigation List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className='relative bg-background shadow-lg rounded-lg overflow-hidden'
          >
            <ul className='flex flex-col p-3 space-y-2'>
              {navItems.map((navItem, idx) => (
                <li key={idx}>
                  <Link
                    href={navItem.link}
                    className='block w-full px-4 py-2 text-lg text-foreground-light dark:text-foreground-dark hover:bg-primary-green transition-all'
                    onClick={() => setOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  );
}
