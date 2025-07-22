
"use client";

import { Briefcase, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function AppHeader() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(routes.login);
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-card">
      <Link className="flex items-center justify-center" href={routes.home}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-bold">ScrapJob</span>
      </Link>
      <nav className="ml-auto flex items-center gap-2 sm:gap-4">
        {loading ? (
           <div className="flex items-center gap-2">
             <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
             <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
           </div>
        ) : user ? (
          <>
            <Link href={routes.jobScraper} className="text-sm font-medium hover:underline underline-offset-4">
              Job Scraper
            </Link>
             <Link href={routes.atsChecker} className="text-sm font-medium hover:underline underline-offset-4">
              ATS Checker
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout <LogOut className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
                <Link href={routes.login}>Sign In</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
