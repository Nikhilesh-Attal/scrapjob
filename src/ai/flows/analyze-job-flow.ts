'use server';

/**
 * @fileOverview Analyzes a job listing against a user profile to provide a comprehensive analysis.
 *
 * - analyzeJob - A function that handles the job analysis process.
 * - AnalyzeJobInput - The input type for the analyzeJob function.
 * - AnalyzeJobOutput - The return type for the analyzeJob function.
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export type AnalyzeJobInput = {
  jobListing: string;
  userProfile: string;
};

export type AnalyzeJobOutput = {
  summary: string;
  requiredSkills: string[];
  missingSkills: string[];
  matchScore: number;
  reasoning: string;
};

export async function analyzeJob(
  input: AnalyzeJobInput
): Promise<AnalyzeJobOutput> {
  const prompt = `You are an expert AI career assistant. Your task is to analyze a job listing and compare it against a user's profile.\n\nFirst, carefully read the job listing and identify all the essential skills, technologies, and qualifications required.\n\nThen, compare this list of required skills with the skills present in the user's profile.\n\nBased on your analysis, provide the following:\n1.  A concise summary of the job.\n2.  A list of all skills required for the job.\n3.  A list of skills that are required by the job but are NOT present in the user's profile.\n4.  A match score percentage, calculated by the formula: ((total required skills - number of missing skills) / total required skills) * 100. Round to the nearest whole number.\n5.  A brief reasoning for your analysis, explaining why the identified skills are missing and how the score was determined.\n\nJob Listing:\n${input.jobListing}\n\nUser Profile:\n${input.userProfile}\n\nReturn your answer as a JSON object with keys: summary, requiredSkills, missingSkills, matchScore, reasoning.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
  });

  let result: AnalyzeJobOutput = {
    summary: '',
    requiredSkills: [],
    missingSkills: [],
    matchScore: 0,
    reasoning: '',
  };
  try {
    const text = completion.choices[0].message?.content || '';
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      result = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
  } catch (e) {
    result.summary = completion.choices[0].message?.content || '';
  }
  return result;
}
