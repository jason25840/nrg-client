'use client';

import React from 'react';

export default function ModalWithContent({ onClose, children }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 🔳 Overlay */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* 🪟 Modal Content */}
      <div className='relative z-10 bg-white p-6 rounded-lg max-w-xl w-full shadow-lg'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-black text-lg'
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
