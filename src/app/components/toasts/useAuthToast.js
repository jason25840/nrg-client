// components/toasts/useAuthToast.js
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const useAuthToast = () => {
  const router = useRouter();

  return (action = 'like') => {
    toast.warn(
      <div className='text-[var(--foreground-light)]'>
        <span>You must sign in to {action} this item.</span>
        <button
          onClick={() => router.push('/signin')}
          className='text-[var(--alert-red)] underline ml-1'
        >
          Sign in now
        </button>
      </div>,
      {
        autoClose: 5000,
        style: {
          background: 'var(--warning-orange)',
          color: 'var(--foreground-dark)',
        },
      }
    );
  };
};
