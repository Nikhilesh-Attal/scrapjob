
"use client";

import { useState } from 'react';
import { Bot, Heart, Linkedin, Twitter, Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: 'Subscribed!',
                    description: result.message,
                });
                setEmail('');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Subscription Failed',
                    description: result.message || 'An unexpected error occurred.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not connect to the server. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Bot className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">ScrapJob</span>
                        </div>
                        <p className="text-muted-foreground max-w-xs">AI-powered tools to accelerate your job search and land your dream role.</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            Built with <Heart className="h-3 w-3 text-red-500" /> using Firebase, n8n & Openai
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <nav className="flex flex-col gap-2">
                                <Link href={routes.jobScraper} className="text-sm text-muted-foreground hover:text-primary">Job Scraper</Link>
                                <Link href={routes.atsChecker} className="text-sm text-muted-foreground hover:text-primary">ATS Checker</Link>
                                <Link href={routes.about} className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
                            </nav>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <nav className="flex flex-col gap-2">
                                <Link href={routes.terms} className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                                <Link href={routes.privacy} className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                            </nav>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Newsletter</h3>
                            <p className="text-sm text-muted-foreground mb-2">Stay up to date with the latest features.</p>
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    className="flex-1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">&copy; 2024 ScrapJob. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="https://x.com/AttalNikhilesh" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
                        <a href="https://github.com/nikhilesh-attal" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
                        <a href={routes.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
