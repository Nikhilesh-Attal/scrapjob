
"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types";
import { Download, Loader2, Search } from "lucide-react";
import { exportToCsv } from "@/lib/utils";
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function JobSearchDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    fetch('/api/scrape')
      .then(res => res.json())
      .then(data => {
        setJobs(data || []); // Ensure jobs is always an array
      })
      .catch(err => {
        console.error("Failed to fetch jobs:", err);
        setJobs([]); // Set to empty array on error
      })
      .finally(() => setLoading(false));
  }, []);
  
  const filteredJobs = useMemo(() => {
    if (!filter) return jobs;
    const lowercasedFilter = filter.toLowerCase();
    return jobs.filter(job => 
        job.title.toLowerCase().includes(lowercasedFilter) ||
        job.company.toLowerCase().includes(lowercasedFilter) ||
        job.location.toLowerCase().includes(lowercasedFilter)
    );
  }, [jobs, filter]);
  
  const handleExport = () => {
    exportToCsv("filtered_jobs.csv", filteredJobs);
  };
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>Search, filter, and analyze job postings from your aggregated list.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                    placeholder="Filter by title, company, or location..." 
                    className="pl-9"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    />
                </div>
                <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
                </Button>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredJobs.map(job => (
                        <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {job.experience && <Badge variant="outline">{job.experience}</Badge>}
                                {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                                {job.contractType && <Badge variant="outline">{job.contractType}</Badge>}
                                {job.workType && <Badge variant="outline">{job.workType}</Badge>}
                            </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            {!job.description ? (
                                <Button size="sm" variant="destructive" disabled>Analyze</Button>
                            ) : (
                                <Button asChild size="sm">
                                    <Link href={`${routes.atsChecker}?jobDescription=${encodeURIComponent(job.description)}`}>Analyze</Link>
                                </Button>
                            )}
                            {!job.applyLink || job.applyLink === '#' ? (
                                <Button size="sm" variant="destructive" disabled>Apply</Button>
                            ) : (
                                <Button asChild variant="secondary" size="sm">
                                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
                                </Button>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                {filteredJobs.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No jobs found matching your criteria.
                    </div>
                )}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
