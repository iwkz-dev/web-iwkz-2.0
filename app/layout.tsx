import type { Metadata } from 'next';
import { Questrial } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { getLayoutMetadata } from '@/lib/seo';

const questrial = Questrial({
  subsets: ['latin'],
  weight: '400',
});

export async function generateMetadata(): Promise<Metadata> {
  return getLayoutMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={questrial.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
