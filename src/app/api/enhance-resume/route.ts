// app/api/enhance-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { convertFileToText } from '@/utils/parseResume'; // Assuming this utility exists
import { DeepSeekChat } from 'langchain/chat_models/deepseek';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';

// route.ts (inside /api/enhance-resume)

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const jobDescription = formData.get('jobDescription') as string;

  const text = await file.text(); // Extract resume text
  const resumeText = text;

  const messages = [
  {
    role: "system",
    content: jobDescription
      ? `You are an expert resume writer and ATS optimizer. Rewrite and enhance the user's resume using a clean, professional modern template. Tailor it specifically to match the provided job description. The output must be a complete, fully formatted resume — ready to be downloaded and submitted as a PDF, Word, or plain text. Keep personal details unchanged and ensure layout is professional and readable without any need for further editing by the user.`
      : `You are a professional resume assistant. Rewrite and enhance the user's resume using a modern, ATS-friendly template. Ensure the resume is fully structured with all standard sections (summary, skills, experience, education, etc.), properly formatted, and ready to download — with no extra formatting needed by the user. Retain original user data and personal details.`,
  },
  {
    role: "user",
    content: jobDescription
      ? `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`
      : resumeText,
  },
];


  // 🔐 Make sure API key is available
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return new Response(
      JSON.stringify({ error: errorData }),
      { status: response.status }
    );
  }

  const json = await response.json();
  const enhanced = json.choices[0].message.content;

  return new Response(JSON.stringify({ enhanced }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
