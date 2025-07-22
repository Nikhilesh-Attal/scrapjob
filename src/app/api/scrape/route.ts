
import { NextResponse } from 'next/server';
import type { Job } from '@/types';

const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || '';

export async function GET(request: Request) {

  if (!GOOGLE_SHEET_URL) {
    console.error('Google Sheet URL is not configured.');
    // Return an empty JSON array to prevent client-side parsing errors.
    return NextResponse.json([], { status: 500 });
  }

  try {
    console.log('Fetching fresh job data from Google Sheet...');
    const response = await fetch(GOOGLE_SHEET_URL, {
        next: { revalidate: 300 } // Re-fetch every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Sheet: ${response.statusText}`);
    }

    const result = await response.json();
    
    // The Apps Script returns { data: [...] }, so we access result.data
    const jobData = result.data;

    if (!Array.isArray(jobData)) {
        throw new Error("Fetched data is not in the expected format. Expected an object with a 'data' array.");
    }
    
    // The first row is headers, remove it before mapping
    const jobRows = jobData.slice(1);
    
    const jobs: Job[] = jobRows.map((item: any, index: number) => {
        const postedDate = item['Posted Date'] ? new Date(item['Posted Date']) : new Date();
        return {
          id: `${item['Apply URL'] || 'job'}-${index}`,
          title: item['Title'] || 'N/A',
          company: item['Company'] || 'N/A',
          location: item['Location'] || 'N/A',
          experience: item['Experience'] || 'N/A',
          salary: item['Salary'] || 'Not Disclosed',
          companyUrl: item['Company URL'] || '#',
          applyLink: item['Apply URL'] || '#',
          date: postedDate.toLocaleDateString(),
          description: item['description'] || '',
          experienceLevel: 'N/A', // This column does not exist in the sheet
          contractType: item['Contract Type'] || 'N/A',
          workType: item['Work Type'] || 'N/A',
        };
    });
    
    console.log(`Successfully fetched ${jobs.length} jobs.`);
    return NextResponse.json(jobs);
  } catch (error)
 {
    console.error('Google Sheet API Error:', error);
    // Return empty array on error to prevent crashing the frontend
    return NextResponse.json([], { status: 500 });
  }
}
