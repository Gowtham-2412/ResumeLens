import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    resumeFile: String,

    jobDescription: String,

    matchedKeywords: [String],

    missingKeywords: [String],
    
    atsScore: Number,

    suggestions: [String]
},
    { timestamps: true }
)

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema)

export default ResumeAnalysis