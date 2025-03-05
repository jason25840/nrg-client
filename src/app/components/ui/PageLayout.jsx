import React from 'react';

export default function PageLayout({ children }) {
  return (
    <div className='min-h-screen pt-[50px] sm:pt-[50px] pb-[50px] px-4 md:px-6 lg:px-8 border-t-[3px] border-primary-blue mt-40 sm:mt-40 max-sm:mt-[100px] mb-20'>
      {children}
    </div>
  );
}
