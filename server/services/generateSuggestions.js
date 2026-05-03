export const generateSuggestions = ({ atsScore, missingKeywords, resumeText })=> {

    const suggestions = []

    if(missingKeywords.length > 0) {
        suggestions.push(
            `Add missing keywords: ${missingKeywords.slice(0, 5).join(", ")}`
        )
    }

    if(atsScore<50) {
        suggestions.push(
            "Your resume is not aligned based on the job description. Tailor it more specifically."
        )
    }

    const actionWords = [ 
        "built", "developed", "designed", "implemented",
        "optimized", "created", "improved" 
    ];

    const hasActionWords = actionWords.some(word => 
        resumeText.toLowerCase().includes(word)
    )

    if(!hasActionWords) {
        suggestions.push(
            "Use action verbs like 'built', 'developed', 'implemented' to describe your work."
        )
    }

    const hasNumbers = /\d/.test(resumeText);

    if (!hasNumbers) {
        suggestions.push(
            "Add measurable achievements (e.g. improved performance by 30%)"
        )
    }

    if(resumeText.length < 300) {
        suggestions.push(
            "Your resume content is too short. Add more details of your projects and experience."
        )
    }

    return suggestions;

}