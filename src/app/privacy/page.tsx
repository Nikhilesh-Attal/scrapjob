import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/routes';

export default function PrivacyPage() {
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
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Your privacy is important to us. It is ScrapJob's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <h3 className="font-semibold text-foreground">1. Information We Collect</h3>
            <p>
              We use Google Sign-In for authentication. When you sign in, we collect and store your Google Account's User ID (UID) and email address in our secure Firebase Firestore database. This allows us to create and manage your account.
            </p>
            <p>
              The professional profile or resume text and files (.pdf, .docx, .txt) you provide for analysis are also collected.
            </p>

            <h3 className="font-semibold text-foreground">2. How We Use Information</h3>
             <p>
              Your UID and email are used to identify you and manage your access to our services. The resume/profile text you provide is used solely for the purpose of comparing it against a job description within the AI analysis tool. The content is sent to a third-party AI provider (Google's Gemini) to perform the analysis.
            </p>
             <p>
              We also track the number of times you use our AI features ('analyze' and 'enhance') to enforce fair usage policies. This usage data is associated with your UID.
            </p>

            <h3 className="font-semibold text-foreground">3. Data Storage and Security</h3>
            <p>
              Your user account information (UID, email, AI usage count) is stored securely in our Firebase Firestore database.
            </p>
            <p>
              Resume files you upload are stored in Firebase Storage, a secure file storage service. A link to this file is stored in your user document in Firestore so you can easily access it later.
            </p>
            <p>
              We are committed to protecting the data you share with us using industry-standard security measures provided by Google Cloud and Firebase.
            </p>
             <p>Last updated: July 31, 2024</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
