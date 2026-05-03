import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js';
import passport from './config/passport.js';
import authRouter from './routes/authRoutes.js'
import resumeRouter from './routes/resumeRoutes.js'

const app=express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}
))
app.use(express.json())
app.use(passport.initialize())

dotenv.config();

app.use('/api/auth', authRouter)
app.use('/api/resume', resumeRouter)

app.listen(process.env.PORT || 4000,async ()=> {
    try {
        await connectDB()
        console.log(`Server is running on port ${process.env.PORT}`)
    } catch (error) {
        console.error(error)
    }
})
