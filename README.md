# 🔍 ResumeLens

ResumeLens is an advanced, AI-powered Applicant Tracking System (ATS) scoring engine and resume analyzer. Built with Node.js, Express, and Google Gemini AI, it helps candidates evaluate how well their resumes match specific job descriptions by extracting keywords, calculating weighted ATS scores, and providing actionable feedback.

## ✨ Features
- **AI-Powered Analysis**: Utilizes Google's Gemini 1.5 Flash model for deep context-aware parsing.
- **Keyword Matching**: Dynamically extracts high-value, role-relevant keywords and normalizes variations.
- **Actionable Insights**: Highlights missing skills and identifies areas for resume improvement.
- **Scoring Engine**: Calculates an overall ATS score based on keyword match, coverage depth, content quality, and readability.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ResumeLens.git
   cd ResumeLens
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Configuration
Create a `.env` file in the `server` directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### Running the Application

1. Start the Backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the Frontend client:
   ```bash
   cd client
   npm run dev  # (or npm start depending on your framework)
   ```