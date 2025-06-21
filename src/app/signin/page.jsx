'use client';

import { useSearchParams } from 'next/navigation'; // ✅ Extract 'from' param and pass to Signin component
import Signin from '../components/auth/Signin';

export default function SigninPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-background'>
      <Signin asPage={true} redirectTo={from} />
    </div>
  );
}
