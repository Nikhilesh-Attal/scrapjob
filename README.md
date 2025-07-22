# ScrapJob - AI-Powered Job Application Assistant

ScrapJob is a Next.js application designed to streamline and supercharge your job search. It combines a powerful job aggregation system with cutting-edge AI tools to help you find the right opportunities and present yourself as the perfect candidate.

## Key Features

### 1. Centralized Job Scraper
- **Live Data Source**: The "Job Scraper" page fetches job listings directly from a Google Sheet, which can be populated with data from various sources.
- **Dynamic Filtering**: Users can instantly search and filter jobs by title, company, and location.
- **CSV Export**: The filtered job list can be downloaded as a CSV file for offline use.
- **Smart Actions**: Buttons to "Analyze" or "Apply" are intelligently enabled or disabled based on data availability, providing a clear user experience.

### 2. AI-Powered ATS Checker
- **Flexible Resume Upload**: Upload your resume as a `.pdf`, `.docx`, or `.txt` file, or simply paste the text.
- **Resume vs. Job Description Analysis**: Get an instant, AI-driven analysis comparing your profile to a job description.
- **Match Score**: Receive a percentage score indicating how well your profile matches the job requirements.
- **Skill Gap Analysis**: The tool identifies which required skills are present in your profile and, more importantly, which are missing.
- **AI-Generated Summary**: Get a quick, AI-generated summary of the job role.

### 3. AI Resume Enhancer
- **One-Click Rewrite**: The "Fix Your Resume" feature uses AI to automatically rewrite and reformat your raw resume text.
- **Professional Formatting**: It corrects spelling and grammar, improves phrasing with action verbs, and organizes the content into a clean, professional layout.

### 4. Simplified & Secure Authentication
- **Continue with Google**: Secure and easy one-click sign-in using Google accounts.
- **Firestore-Backed**: User data, including AI usage counts and resume links, is securely managed in Firestore.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **UI**: ShadCN UI, Tailwind CSS
- **AI**: Google Gemini via Genkit
- **Authentication & Database**: Firebase Authentication, Firestore, Firebase Storage
- **Data Source**: Google Sheets via Google Apps Script
- **Deployment**: Firebase App Hosting
