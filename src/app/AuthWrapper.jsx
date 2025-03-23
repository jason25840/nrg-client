'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation'; // ✅ Get the current path
import { fetchUser } from './redux/slices/authSlice';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Sidebar from './components/ui/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);
  const pathname = usePathname(); // ✅ Get current path
  const isDashboard = pathname.startsWith('/dashboard'); // ✅ Check if in dashboard

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUser());
    }
  }, []);

  if (status === 'loading') {
    return (
      <>
        {!isDashboard && <Header />} {/* 🚫 No Header on dashboard */}
        <main className='w-full flex flex-col'>
          <LoadingSpinner />
        </main>
        {!isDashboard && <Footer />} {/* Optional: remove footer too */}
      </>
    );
  }

  if (isAuthenticated && isDashboard) {
    return (
      <div className='flex'>
        <Sidebar />
        <main className='flex-1'>{children}</main>
      </div>
    );
  }

  return (
    <>
      {!isDashboard && <Header />} {/* 🚫 No Header on dashboard */}
      <main className='w-full flex flex-col'>{children}</main>
      {!isDashboard && <Footer />} {/* Optional */}
    </>
  );
}
