import { atsScoreCalculator } from "../utils/scoreCalculator.js"
import { generateSuggestions } from "./generateSuggestions.js"
import { matchKeywords } from "./keywordMatcher.js"

export const resumeAnalyze = (resumeText, jobDescription) => {

    const { matchedKeywords, missingKeywords, jobKeywords, matchedWeight, totalWeight } = matchKeywords(resumeText, jobDescription)

    const atsScore = atsScoreCalculator(matchedWeight, totalWeight)

    const suggestions = generateSuggestions({atsScore, missingKeywords, resumeText})

    return {
        atsScore, matchedKeywords, missingKeywords, suggestions
    }

}   
