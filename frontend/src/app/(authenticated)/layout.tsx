'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}
