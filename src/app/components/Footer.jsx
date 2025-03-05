import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full fixed bottom-0 z-50 bg-gradient-to-r from-[var(--primary-blue)] via-[var(--primary-green)]/via-[var(--accent-pink)] to-[var(--accent-orange)] text-primary p-3 sm:p-4'>
      <div className='container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm md:text-base'>
        <p className='text-white'>
          © 2025 NRG Playground. All rights reserved.
        </p>
        <ul className='flex space-x-3'>
          <li>
            <Link href='/' className='text-white hover:text-blue-200'>
              Home
            </Link>
          </li>
          <li>
            <Link href='/contact' className='text-white hover:text-blue-200'>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
