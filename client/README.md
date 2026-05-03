# 🎨 ResumeLens - Client Frontend

This directory contains the frontend user interface for ResumeLens. It provides a clean, intuitive experience for users to upload their resumes, paste job descriptions, and view their AI-generated ATS scores and insights.

## 🛠️ Setup & Development

To get the frontend running locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   If your frontend needs to know where the backend API lives, create a `.env` file in this `client` folder. For example:
   ```env
   VITE_API_URL=http://localhost:5000
   # OR for Create React App:
   # REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # OR npm start
   ```

## 📦 Build for Production

To create a production-ready build, simply run `npm run build`. This generates an optimized build folder (`dist/` or `build/`) that can be easily deployed to platforms like Vercel, Netlify, or AWS.