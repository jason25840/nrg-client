'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageLayout from '../../components/ui/PageLayout';
import GeneralChat from './components/GeneralChat.jsx';

export default function GeneralChatPage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  if (!user) {
    return null; // ⏳ Wait for redirect
  }

  return (
    <PageLayout>
      <div className='flex flex-col items-center mt-10'>
        <h1 className='text-4xl font-bold mb-6'>NRG Chat Board</h1>
        <GeneralChat />
      </div>
    </PageLayout>
  );
}
