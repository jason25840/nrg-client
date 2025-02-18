'use client';

import { useSelector } from 'react-redux';
import Sidebar from './components/ui/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

export default function AuthWrapper({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth); // ✅ Get auth state

  return isAuthenticated ? (
    <div className='flex'>
      <Sidebar /> {/* ✅ Sidebar only for logged-in users */}
      <main className='flex-1'>{children}</main>
    </div>
  ) : (
    <>
      <Header />
      <main className='container w-full min-h-screen flex flex-col relative z-10'>
        {children}
      </main>
      <Footer />
    </>
  );
}
