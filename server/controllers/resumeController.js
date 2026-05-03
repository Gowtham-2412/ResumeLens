import fs from 'fs'
import ResumeAnalysis from "../models/analysisModel.js";
import { resumeAnalyze } from "../services/resumeAnalyzer.js";
import parseResume from "../services/resumeParser.js";

const uploadResume = async (req, res) => {
    let filePath = null
    try {

        const { jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description required" });
        }

        filePath = req.file.path;
        const resumeText = await parseResume(filePath)


        const analysis = resumeAnalyze(resumeText, jobDescription)

        const saveAnalysis = await ResumeAnalysis.create({
            userId: req.user.id,
            resumeFile: req.file.filename,
            jobDescription,
            matchedKeywords: analysis.matchedKeywords,
            missingKeywords: analysis.missingKeywords,
            atsScore: analysis.atsScore,
            suggestions: analysis.suggestions
        })

        fs.unlink(filePath, (err) => {
            if (err) console.error("File not deleted:", err)
        })

        res.json({
            message: "ATS analysis completed successfully",
            analysis: saveAnalysis
        })

    } catch (error) {

        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error("File deletion failed:", err);
            });
        }

        res.status(500).json({ message: "ATS analysis failed", error: error.message });
    }
}

const getHistory = async (req, res) => {

    try {
        const history = await ResumeAnalysis.find({
            userId: req.user.id
        }).sort({ createdAt: -1 })

        res.json(history)

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history" })
    }

}

const getAnalysisById = async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!analysis) {
            return res.status(404).json({ message: "Not Found" })
        }

        res.json({ analysis })

    } catch (error) {
        res.status(500).json({ message: "Error fetching analysis" })
    }
}

const deleteAnalysis = async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!analysis) {
            return res.status(404).json({ message: "Not Found" })
        }

        res.json({ message: "Analysis deleted successfully", id: req.params.id })

    } catch (error) {
        res.status(500).json({ message: "Error deleting analysis" })
    }
}

export { uploadResume, getHistory, getAnalysisById, deleteAnalysis }
