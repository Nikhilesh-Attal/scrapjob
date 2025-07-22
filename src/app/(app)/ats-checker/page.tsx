"use client";

import { analyzeJob, AnalyzeJobInput, AnalyzeJobOutput } from '@/ai/flows/analyze-job-flow';
import { enhanceResume, EnhanceResumeInput, EnhanceResumeOutput } from '@/ai/flows/enhance-resume-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { checkAndRecordAction } from '@/lib/user-actions';
import { AlertTriangle, CheckCircle2, FileUp, Loader2, Sparkles, Trophy, Wand2, XCircle } from 'lucide-react';
import mammoth from 'mammoth';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';

// Setting worker path for pdf.js
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

// Download helper
function downloadResume(content: string, type: 'txt' | 'pdf') {
  let blob: Blob;
  let filename: string;
  if (type === 'txt') {
    blob = new Blob([content], { type: 'text/plain' });
    filename = 'enhanced-resume.txt';
  } else {
    // For PDF, just download as .txt for now (real PDF export needs a library)
    blob = new Blob([content], { type: 'application/pdf' });
    filename = 'enhanced-resume.pdf';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadResumeDocx(content: string) {
  const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'enhanced-resume.docx';
  a.click();
  URL.revokeObjectURL(url);
}

// Simple code-based ATS score function
function codeBasedAtsScore(jobDescription: string, userProfile: string) {
  const requiredSkills = jobDescription
    .split(/\n|,|\.|;|\||\//)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 2 && /[a-z]/i.test(s));
  const uniqueSkills = Array.from(new Set(requiredSkills));
  const userProfileLower = userProfile.toLowerCase();
  const missingSkills = uniqueSkills.filter(skill =>
    skill && !userProfileLower.includes(skill)
  );
  if (uniqueSkills.length >= 3) {
    const matchScore = Math.round(
      ((uniqueSkills.length - missingSkills.length) / uniqueSkills.length) * 100
    );
    return {
      summary: '', // code cannot summarize
      requiredSkills: uniqueSkills,
      missingSkills,
      matchScore,
      reasoning: '', // code cannot reason
      codeOnly: true,
    };
  }
  return null;
}

export default function AtsCheckerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading: authLoading } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [fixing, setFixing] = useState(false);
  const [fixProgress, setFixProgress] = useState('');
  const [enhancedResume, setEnhancedResume] = useState('');
  
  const [jobDescription, setJobDescription] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeJobOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [readyMessage, setReadyMessage] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const jd = searchParams.get('jobDescription');
    if (jd) {
      setJobDescription(jd);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userData?.resumeURL) {
      fetch(userData.resumeURL)
        .then(res => res.text())
        .then(text => {
          setUserProfile(text);
          setAnalysisResult(null);
          setIsLoading(false);
          setReadyMessage('Resume loaded. Ready for analysis.');
        })
        .catch(err => console.error("Could not load resume from URL", err));
    }
  }, [userData?.resumeURL]);

  const handleAnalyze = async () => {
    if (!jobDescription || !userProfile) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both a job description and your resume.",
      });
      return;
    }
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to use this feature." });
        return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setReadyMessage(null);

    // Hybrid: Try code-based ATS score first
    const codeResult = codeBasedAtsScore(jobDescription, userProfile);
    if (codeResult) {
      setAnalysisResult({
        summary: 'Code-based analysis: AI was not used. (Summary not available)',
        requiredSkills: codeResult.requiredSkills,
        missingSkills: codeResult.missingSkills,
        matchScore: codeResult.matchScore,
        reasoning: 'This result was generated using a code-based approach. For a more detailed analysis, try rewording your job description or resume.',
      });
      setIsLoading(false);
      return;
    }

    // Only call AI if code-based approach cannot provide a result
    const actionResult = await checkAndRecordAction(user.uid, 'analyze');
    if (!actionResult.allowed) {
        toast({ variant: "destructive", title: "Limit Reached", description: actionResult.reason });
        setIsLoading(false);
        return;
    }
    
    try {
      const input: AnalyzeJobInput = { jobListing: jobDescription, userProfile };
      const result = await analyzeJob(input);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixResume = async () => {
    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Missing Resume",
        description: "Please upload or paste your resume first.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to use this feature.",
      });
      return;
    }

    setFixing(true);
    setFixProgress('Preparing enhancement...');

    const actionResult = await checkAndRecordAction(user.uid, 'enhance');
    if (!actionResult.allowed) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: actionResult.reason,
      });
      setFixing(false);
      return;
    }

        try {
            const input: EnhanceResumeInput = {
                userProfile,
                jobListing: jobDescription || '',
            };
            setFixProgress('Sending to AI...');
            const result: EnhanceResumeOutput = await enhanceResume(input);
            console.log('AI enhanceResume result:', result);
            console.log('AI enhancedProfile:', result?.enhancedProfile);

            setFixProgress('Applying changes...');
            setEnhancedResume(result.enhancedProfile);
            // Do NOT overwrite userProfile here; keep the original resume

            toast({
                title: "Resume Enhanced",
                description: "Your resume has been successfully enhanced.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Enhancement Failed",
                description: "An error occurred during enhancement.",
            });
        } finally {
            setFixing(false);
            setFixProgress('');
        }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    if(!file) return;

    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to upload a resume." });
        return;
    }

    setIsLoading(true);
    let text = '';
    try {
        if (file.type === 'application/pdf') {
            const data = await file.arrayBuffer();
            const pdf = await getDocument(data).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => ('str' in item ? item.str : '')).join('\n');
            }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
        }
        text = text
              .replace(/\r\n|\r/g, '\n')
              .replace(/[ \t]+\n/g, '\n')
              .replace(/\n{2,}/g, '\n\n');
        setUserProfile(text.trim());
    } catch (error) {
      console.error('Error parsing file:', error);
    }

    setIsLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Debug: log when enhanced resume updates
  useEffect(() => {
    console.log("Enhanced resume updated:", enhancedResume);
  }, [enhancedResume]);

  // Auto-scroll to enhanced resume box
  useEffect(() => {
    if (enhancedResume && resumeRef.current) {
        resumeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [enhancedResume]);

  return (
    <>
      <div className="container mx-auto p-0 md:p-4 space-y-8">
      <div className="text-center mt-4">
        <h1 className="text-3xl md:text-4xl font-bold">ATS Checker & Resume Enhancer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Paste a job description and your resume to see how you match up, then let our AI help you fix it.
        </p>
        {readyMessage && (
          <div className="mt-4 text-green-600 font-semibold">{readyMessage}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="border-dashed border-2">
                     <CardHeader>
                         <CardTitle>1. Job Description</CardTitle>
                         <CardDescription>Paste the full job description below.</CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Textarea
                             placeholder="Paste job description here..."
                             className="h-64 bg-transparent"
                             value={jobDescription}
                             onChange={(e) => setJobDescription(e.target.value)}
                             disabled={isLoading || isEnhancing}
                         />
                     </CardContent>
                 </Card>
                 <Card className="border-dashed border-2">
                     <CardHeader>
                         <CardTitle>2. Your Profile / Resume</CardTitle>
                         <CardDescription>Paste your resume or upload a file.</CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Textarea
                             placeholder="Paste your resume here..."
                             className="h-64 bg-transparent font-mono whitespace-pre-wrap"
                             value={userProfile}
                             onChange={(e) => setUserProfile(e.target.value)}
                             disabled={isLoading || isEnhancing}
                         />
                         <div className="mt-4 flex flex-col sm:flex-row gap-2">
                             <Button asChild variant="secondary" className="flex-1">
                                 <Label className="cursor-pointer">
                                     <FileUp className="mr-2 h-4 w-4" /> Upload File
                                     <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />
                                 </Label>
                             </Button>
                             <Button 
                                 onClick={handleFixResume}
                                 disabled={isEnhancing || isLoading || !userProfile || fixing}
                                 className="flex-1"
                             >
                                 {isEnhancing ? (
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : (
                                     <Wand2 className="mr-2 h-4 w-4" />
                                 )}
                                 Fix My Resume
                             </Button>
                         </div>
                     </CardContent>
                 </Card>
             </div>

      <div className="text-center">
        <Button onClick={handleAnalyze} disabled={isLoading || isEnhancing || !jobDescription || !userProfile} size="lg">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />Analyze with AI</>
          )}
        </Button>
      </div>

      {isLoading && (
          <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4 h-48">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-semibold">Analyzing...</p>
                    <p className="text-muted-foreground">The AI is comparing your profile against the job. This may take a moment.</p>
                </div>
              </CardContent>
          </Card>
      )}

      {isEnhancing && (
          <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4 h-48">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-semibold">Enhancing your resume...</p>
                    <p className="text-muted-foreground">The AI is rewriting your resume to make it more professional. This may take a moment.</p>
                </div>
              </CardContent>
          </Card>
      )}

      {analysisResult && (
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Trophy className="text-yellow-400" /> Analysis Complete</CardTitle>
            <CardDescription>{analysisResult.reasoning}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Match Score: {analysisResult.matchScore}%</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={analysisResult.matchScore} className="h-3" indicatorClassName={getScoreColor(analysisResult.matchScore)} />
                </CardContent>
            </Card>

            {fixing && <div>{fixProgress}</div>}

            {enhancedResume && (
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Enhanced Resume</h3>
                <pre className="bg-gray-100 p-4 rounded">{enhancedResume}</pre>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => downloadResume(enhancedResume, 'txt')}
                    variant="outline"
                  >
                    Download as .txt
                  </Button>
                  <Button
                    onClick={() => downloadResume(enhancedResume, 'pdf')}
                    variant="outline"
                  >
                    Download as PDF
                  </Button>
                </div>
              </div>
            )}

             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Job Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{analysisResult.summary}</p>
                </CardContent>
             </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg mb-2 flex items-center">
                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                            Required Skills Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.requiredSkills.filter(skill => !analysisResult.missingSkills.includes(skill)).map((skill) => (
                                <div key={skill} className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-sm">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg mb-2 flex items-center">
                            <XCircle className="mr-2 h-5 w-5 text-red-500" />
                            Missing Keywords
                        </CardTitle>
                    </CardHeader>
                     <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.missingSkills.map((skill) => (
                                <div key={skill} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-sm">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {analysisResult.missingSkills.length > 0 && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-red-400">
                    <AlertTriangle className="h-4 w-4 !text-red-400" />
                    <AlertTitle>Action Recommended</AlertTitle>
                    <AlertDescription>
                        Consider adding the missing keywords to your resume to improve your match score and pass through automated screening systems. You can use the "Fix My Resume" button to get AI assistance.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Resume Box (moved to bottom) */}
      {typeof enhancedResume === 'string' && enhancedResume.trim() !== '' && (
        <div style={{
          background: '#e6ffed',
          color: '#1a3d1a',
          padding: '20px',
          margin: '24px 0',
          fontSize: '15px',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(34,197,94,0.08)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '1.2em', marginBottom: 8, color: '#15803d' }}>Enhanced Resume</div>
          <div style={{ fontSize: '0.95em', marginBottom: 12, color: '#166534' }}>This is your improved resume. You can download it below.</div>
          <pre style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 400,
            overflow: 'auto',
            marginBottom: 16
          }}>{enhancedResume}</pre>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              onClick={() => downloadResume(enhancedResume, 'txt')}
              variant="outline"
            >
              Download as .txt
            </Button>
            {/*
            <Button
              onClick={() => downloadResume(enhancedResume, 'pdf')}
              variant="outline"
            >
              Download as PDF
            </Button>
            <Button
              onClick={() => downloadResumeDocx(enhancedResume)}
              variant="outline"
            >
              Download as Word
            </Button>
            */}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
