
import { Bot, FileScan, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-36 border-b bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full animate-float">
                       <Bot className="h-12 w-12 text-primary" data-ai-hint="robot illustration" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                      Your AI Job Search Co-Pilot
                    </h1>
                  </div>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                    ScrapJob centralizes job listings and uses AI to analyze how your resume matches up, helping you land your next opportunity faster.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href={routes.login}>Get Started Free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-24 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Supercharge Your Job Hunt</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        From finding the right roles to perfecting your application, our tools are designed to give you an edge.
                        </p>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto mt-12">
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1 bg-background/50">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                             <div className="p-3 bg-primary/10 rounded-full">
                                <Search className="h-6 w-6 text-primary" />
                             </div>
                            <CardTitle>Centralized Job Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Aggregate job postings into a single, filterable dashboard. Stop juggling tabs and start organizing your search.
                            </CardDescription>
                            <Button asChild>
                                <Link href={routes.jobScraper}>Try the Job Scraper</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1 bg-background/50">
                         <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <FileScan className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>AI-Powered ATS Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Get an instant analysis of how your resume matches a job description, including a match score and missing keywords.
                            </CardDescription>
                             <Button asChild>
                                <Link href={routes.atsChecker}>Analyze Your Resume</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
