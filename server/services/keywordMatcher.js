import { extractKeywords } from "../utils/keywordExtractor.js"

export const matchKeywords = (resumeText, jobDescription) => {
    const resumeKeywordData = extractKeywords(resumeText);
    const jobKeywordData = extractKeywords(jobDescription);

    const resumeKeywordSet = resumeKeywordData.keywordSet;
    const jobKeywordCandidates = jobKeywordData.keywords;

    const matchedCandidates = jobKeywordCandidates.filter(({ term }) =>
        resumeKeywordSet.has(term)
    );

    const missingCandidates = jobKeywordCandidates.filter(({ term }) =>
        !resumeKeywordSet.has(term)
    );

    const matchedKeywords = matchedCandidates.map(({ term }) => term);
    const missingKeywords = missingCandidates.map(({ term }) => term);
    const jobKeywords = jobKeywordCandidates.map(({ term }) => term);
    const resumeKeywords = resumeKeywordData.keywords.map(({ term }) => term);
    const matchedWeight = matchedCandidates.reduce((sum, candidate) => sum + candidate.weight, 0);
    const totalWeight = jobKeywordCandidates.reduce((sum, candidate) => sum + candidate.weight, 0);

    return {
        resumeKeywords,
        jobKeywords,
        matchedKeywords,
        missingKeywords,
        matchedWeight,
        totalWeight
    }

}
