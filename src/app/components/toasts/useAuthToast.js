// components/toasts/useAuthToast.js
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const useAuthToast = () => {
  const router = useRouter();

  return (action = 'like') => {
    toast.warn(
      <div>
        <span>You must sign in to {action} this item.</span>
        <button
          onClick={() => router.push('/signin')}
          className='text-primary-blue underline ml-1'
        >
          Sign in now
        </button>
      </div>,
      { autoClose: 5000 }
    );
  };
};
