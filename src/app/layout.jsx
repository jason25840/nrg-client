import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { Providers } from './providers';
import AuthWrapper from './AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'New River Gorge Playground',
  description: 'Connect with outdoor enthusiasts in the New River Gorge area',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body className={`${inter.className} bg-white text-black`}>
        <Providers>
          <AuthWrapper>
            <main className='flex-1'>{children}</main>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
