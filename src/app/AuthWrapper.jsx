'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from './redux/slices/authSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import useHasMounted from './hooks/useHasMounted';

export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const { status, user, isAuthenticated } = useSelector((state) => state.auth);
  const hasMounted = useHasMounted();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (!hasMounted || (status === 'loading' && user === null)) {
    return (
      <>
        <Header />
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className='w-full flex flex-col'>{children}</main>
      <Footer />
    </>
  );
}
