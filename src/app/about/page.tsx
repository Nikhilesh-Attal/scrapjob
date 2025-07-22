import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/routes';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-card">
        <a className="flex items-center justify-center" href={routes.home}>
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">ScrapJob</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href={routes.home}
          >
            Back to Home
          </a>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About ScrapJob</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ScrapJob is an innovative application designed to streamline the job search process for professionals everywhere. In today's competitive market, finding the right opportunity requires more than just searching—it requires strategy and a polished presentation.
            </p>
            <p>
              Our platform features a **Job Scraper** that aggregates job listings from a centralized Google Sheet, allowing you to have a single source of truth for all your tracked opportunities. You can filter and search through these listings with ease and export them for offline use.
            </p>
            <p>
              The heart of ScrapJob is our AI-powered **ATS Checker & Resume Enhancer**. By uploading your resume (in .pdf, .docx, or .txt format) and pasting in a job description, our AI provides a detailed analysis, including a match score and a list of missing keywords. This insight helps you tailor your application for each specific role.
            </p>
            <p>
              Furthermore, our "Fix Your Resume" feature uses generative AI to rewrite and professionally format your profile, ensuring you always put your best foot forward. ScrapJob is more than just a scraper; it's a career assistant dedicated to helping you find and land your next opportunity, faster and smarter.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
