
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { routes } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(routes.login);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
           <Skeleton className="h-6 w-32" />
           <div className="ml-auto flex items-center gap-2">
             <Skeleton className="h-8 w-20" />
             <Skeleton className="h-8 w-20" />
           </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="w-full h-[80vh]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
       <AppHeader />
       <main className="flex-1 bg-muted/20 p-4 md:p-6">{children}</main>
    </div>
  );
}
