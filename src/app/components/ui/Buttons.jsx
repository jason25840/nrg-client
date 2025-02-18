import React from 'react';

function Button({
  children,
  className = '',
  onClick,
  variant = 'primary',
  type,
}) {
  const baseStyles =
    'relative inline-flex h-12 overflow-hidden rounded-full px-6 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background button-bg-light';

  const variantStyles = {
    primary: 'focus:ring-primary-blue',
    secondary: 'focus:ring-gray-600',
    danger: 'focus:ring-red-600',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {/* Outer Border Effect */}
      <span className='absolute inset-0 rounded-full border-[2px] border-transparent animate-border-glow' />

      {/* Inner Button Content */}
      <span className='relative z-10 inline-flex h-full w-full items-center justify-center rounded-full text-foreground-light dark:text-foreground-dark'>
        {children}
      </span>
    </button>
  );
}

export default Button;
