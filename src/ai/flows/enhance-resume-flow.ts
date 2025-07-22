
'use server';
/**
 * @fileOverview Enhances a user's resume/profile based on a specific job description.
 *
 * - enhanceResume - A function that rewrites a user profile for a job.
 * - EnhanceResumeInput - The input type for the enhanceResume function.
 * - EnhanceResumeOutput - The return type for the enhanceResume function.
 */

'use server';

export type EnhanceResumeInput = {
  userProfile: string;
};

export type EnhanceResumeOutput = {
  enhancedProfile: string;
};

export async function enhanceResume(
  input: EnhanceResumeInput
): Promise<EnhanceResumeOutput> {
  const prompt = `Please improve my resume for maximum ATS compatibility, clarity, and professional appeal. Add a strong summary at the top based on my background. Organize skills into logical categories (e.g., programming, tools, frameworks, etc.). Enhance project descriptions using action verbs and measurable outcomes. Use consistent verb tenses and fix grammar issues. Clearly distinguish between internships, certifications, and hackathons in the experience section. Format everything cleanly with readable sections, bullet points, and aligned dates. Tailor the tone to suit roles in technology, development, or data-related fields. Keep the resume concise, impactful, and easy to scan.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          { role: "system", content: "You are a helpful resume optimization assistant." },
          //{ role: "user", content: prompt },
          { role: "user", content: input.userProfile }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error Response:", errorBody);
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const enhancedProfile = data.choices[0]?.message?.content || "";

    if (!enhancedProfile) {
      throw new Error("Received an empty response from the AI.");
    }

    return {
      enhancedProfile: enhancedProfile.trim(),
    };
  } catch (error) {
    console.error("Failed to enhance resume:", error);
    throw new Error("The AI resume enhancement service is currently unavailable. Please try again later.");
  }
}
