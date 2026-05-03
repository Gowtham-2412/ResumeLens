import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
import { uploadResume, getAnalysisById, getHistory, deleteAnalysis } from '../controllers/resumeController.js'

const router = express.Router()

router.post('/upload', authMiddleware,upload.single("resume"), uploadResume)
router.get("/history", authMiddleware, getHistory)
router.get('/:id', authMiddleware, getAnalysisById)
router.delete('/:id', authMiddleware, deleteAnalysis)

export default router
