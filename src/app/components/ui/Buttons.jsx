'use client';

import React from 'react';

function Button({
  children,
  className = '',
  onClick,
  variant = 'primary',
  type = 'button',
  pulse = false, // ✅ New pulse option
}) {
  const baseStyles =
    'relative inline-flex h-12 overflow-hidden rounded-full px-6 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200';

  const variantStyles = {
    primary:
      'bg-[--primary-blue] text-[--foreground-dark] focus:ring-[--primary-blue] hover:bg-[--primary-green]',
    secondary:
      'bg-[--primary-green] text-[--foreground-dark] focus:ring-[--primary-green] hover:bg-[--accent-pink]',
    danger:
      'bg-[--accent-pink] text-[--foreground-dark] focus:ring-[--accent-pink] hover:bg-[--primary-blue]',
  };

  const pulseStyle = pulse ? 'animate-pulse-slow' : ''; // ✅ Apply pulse only if requested

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${pulseStyle} ${className}`}
      onClick={onClick}
    >
      <span className='absolute inset-0 rounded-full border-[2px] border-transparent animate-border-glow' />
      <span className='relative z-10 inline-flex h-full w-full items-center justify-center rounded-full'>
        {children}
      </span>
    </button>
  );
}

export default Button;
