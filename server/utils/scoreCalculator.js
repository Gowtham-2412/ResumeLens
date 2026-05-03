export const atsScoreCalculator = (matched, total) => {

    if(total == 0) return 0;

    const score = (matched/total)*100;

    const finalScore = Math.round(score)
    return finalScore;
}