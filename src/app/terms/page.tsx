import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/routes';

export default function TermsPage() {
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
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Welcome to ScrapJob. These terms and conditions outline the rules and regulations for the use of ScrapJob's Website, located at this domain. By accessing this website we assume you accept these terms and conditions. Do not continue to use ScrapJob if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <h3 className="font-semibold text-foreground">1. License</h3>
            <p>
              Unless otherwise stated, ScrapJob and/or its licensors own the intellectual property rights for all material on ScrapJob. All intellectual property rights are reserved. You may access this from ScrapJob for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <h3 className="font-semibold text-foreground">2. User Content & AI Usage</h3>
             <p>
              Our Service allows you to upload or paste your resume and other professional information ("User Content") for analysis. You are responsible for the User Content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
             <p>
              Our AI features are subject to fair usage limits, which are monitored on a per-user basis. Exceeding these limits may result in a temporary suspension of access to AI-powered features. We reserve the right to modify these limits at any time.
            </p>
            <h3 className="font-semibold text-foreground">3. Disclaimer</h3>
            <p>
              The materials and AI-generated content on ScrapJob's website are provided on an 'as is' basis. ScrapJob makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. The AI analysis is for informational purposes only and is not a guarantee of employment.
            </p>
            <p>Last updated: July 31, 2024</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
