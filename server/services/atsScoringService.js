import { GoogleGenerativeAI } from '@google/generative-ai';

export const evaluateResumeWithATS = async (resumeText, jobDescription) => {
  // Input Validation (Extraction Stability)
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
    throw new Error("Invalid or insufficient resume text extracted. Please ensure the file is readable.");
  }
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
    throw new Error("Invalid or insufficient job description provided.");
  }

  // Ensure the API key is present before attempting to call the service
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }

  // Initialize the Gemini SDK
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Use gemini-1.5-flash for fast and structured text/JSON generation
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      // This guarantees the output is strictly JSON without markdown wrappers
      responseMimeType: "application/json",
    }
  });

  const prompt = `
You are an advanced ATS (Applicant Tracking System) scoring engine.
Your job is to evaluate how well a candidate's resume matches a job description.
You must behave like a real ATS used by recruiters.

INPUT:
1. Resume text: ${resumeText}
2. Job description text: ${jobDescription}

STEP 1: EXTRACT RELEVANT KEYWORDS (NOISE FILTERING ENABLED)
From BOTH resume and job description:
* Extract ONLY high-value, meaningful, role-relevant keywords, skills, and qualifications.
* For Tech roles include: software, tools, frameworks, and methodologies.
* For Non-Tech roles include: industry-specific terminology, hard skills, domain knowledge, certifications, and core competencies.
* Normalize variations (e.g., "node js" -> "nodejs", "ms office" -> "microsoft office").
* Remove duplicates
* STRICTLY IGNORE: stop words (e.g., "and", "the", "with"), generic corporate jargon (e.g., "synergy", "proactive"), common verbs ("managed", "led", "developed"), and soft skills with no measurable value (e.g., "team player", "hard worker", "responsibilities").

STEP 2: CLASSIFY JOB DESCRIPTION KEYWORDS
Divide JD keywords into REQUIRED and OPTIONAL.

STEP 3: MATCHING
Compare resume keywords with JD keywords to find matched_keywords and missing_keywords.

STEP 4: SCORING LOGIC
Calculate ATS score using weighted logic:
1. Keyword Match Score (60%)
2. Keyword Coverage Depth (15%)
3. Resume Content Quality (15%)
4. Readability & Structure (10%)
FINAL SCORE: Combine and clamp between 0 and 100.

STEP 5: OUTPUT
Return ONLY JSON in this format:
{
  "score": number,
  "matched_keywords": [],
  "missing_keywords": [],
  "breakdown": {
    "keyword_match": number,
    "coverage_depth": number,
    "content_quality": number,
    "readability": number
  },
  "insights": ["string", "string"]
}
  `;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Failed to generate ATS score via Gemini API:", error);
    
    // Graceful Fallback Response
    return {
      score: 0,
      matched_keywords: [],
      missing_keywords: [],
      breakdown: {
        keyword_match: 0,
        coverage_depth: 0,
        content_quality: 0,
        readability: 0
      },
      insights: [
        "AI Analysis is temporarily unavailable due to a service timeout or error.",
        "Please review the manual suggestions provided below or try again later."
      ]
    };
  }
};