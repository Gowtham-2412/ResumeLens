import React, { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Sparkles,
  UploadCloud,
  Target,
  FileCheck
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import { useAnalysis } from '../../context/AnalysisContext'

const scoreStyles = [
  'from-[#0f766e] to-[#3a7c7b]',
  'from-[#f0b56a] to-[#d99d52]',
  'from-[#6ba3ef] to-[#4477c7]',
  'from-[#2a8f80] to-[#1d6358]'
]

const analysisSteps = [
  'Parsing resume structure',
  'Extracting role keywords',
  'Calculating ATS score'
]

const sampleJobDescription = `Frontend Developer

We are looking for a React developer with strong JavaScript, HTML, CSS, Git, REST API, and TypeScript experience. The candidate should build reusable UI components, improve application performance, and collaborate with product teams.`

const AnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [activeTab, setActiveTab] = useState('ATS Score')

  const {
    analysis,
    loading,
    error,
    analyzeResume,
    clearAnalysis
  } = useAnalysis()

  const hasJobDescription = jobDescription.trim().length > 0
  const overallScore = analysis?.atsScore ?? null

  const uploadStatus = useMemo(() => {
    if (!selectedFile) return null

    const sizeInMb = selectedFile.size / (1024 * 1024)

    return {
      name: selectedFile.name,
      size: `${sizeInMb.toFixed(1)} MB`
    }
  }, [selectedFile])

  const categoryScores = useMemo(() => {
    if (!analysis) return []

    const matchedCount = analysis.matchedKeywords?.length ?? 0
    const missingCount = analysis.missingKeywords?.length ?? 0
    const totalKeywords = matchedCount + missingCount
    const keywordMatchScore = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0
    const missingCoverageScore = totalKeywords > 0 ? Math.max(0, 100 - Math.round((missingCount / totalKeywords) * 100)) : 0
    const suggestionLoad = analysis.suggestions?.length ?? 0
    const readinessScore = Math.max(0, Math.min(100, 100 - suggestionLoad * 12))

    return [
      {
        title: 'ATS Match Score',
        score: analysis.atsScore ?? 0,
        description: 'Overall alignment with the target role requirements.'
      },
      {
        title: 'Keyword Match',
        score: keywordMatchScore,
        description: `${matchedCount} crucial keywords successfully identified.`
      },
      {
        title: 'Missing Terms',
        score: missingCoverageScore,
        description: `${missingCount} important industry terms are missing.`
      },
      {
        title: 'Content Quality',
        score: readinessScore,
        description: `${suggestionLoad} actionable suggestions for improvement.`
      }
    ]
  }, [analysis])

  const suggestionCards = useMemo(() => {
    if (!analysis?.suggestions?.length) return []

    return analysis.suggestions.map((suggestion, index) => ({
      title: `Improvement Priority ${index + 1}`,
      points: [suggestion]
    }))
  }, [analysis])

  const handleFileChange = (event) => {
    const [file] = event.target.files || []
    setSelectedFile(file ?? null)
  }

  const handleClearInputs = () => {
    setSelectedFile(null)
    setJobDescription('')
    clearAnalysis()
  }

  const handleUseSampleRole = () => {
    setJobDescription(sampleJobDescription)
  }

  const handleUpload = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      return
    }

    const formData = new FormData()
    formData.append('resume', selectedFile)
    formData.append('jobDescription', jobDescription.trim())

    try {
      await analyzeResume(formData)
      setActiveTab('ATS Score')
    } catch {
      // Error state is handled by context and rendered in the page.
    }
  }

  const tabs = ['ATS Score', 'Matched vs Missing', 'Suggestions', 'Breakdown']

  return (
    <div className='min-h-screen text-text-primary bg-app-background'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-6 sm:pt-8'>
          <section className='saas-panel-dark overflow-hidden rounded-lg p-6 sm:p-8'>
            <div className='grid gap-8 xl:grid-cols-[1.1fr_0.9fr]'>
              <div>
                <div className='inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-100'>
                  <Sparkles size={14} />
                  ATS Analysis
                </div>
                <h1 className='mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl'>Optimize your resume for the ATS.</h1>
                <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
                  Upload your professional resume and the target job description. ResumeLens parses the file, compares role keywords, and turns the result into a focused improvement plan.
                </p>

                {error && (
                  <div className='mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                    <AlertCircle size={18} />
                    <span className='font-medium'>{error}</span>
                  </div>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-lg border border-white/10 bg-white/[0.08] p-5'>
                  <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-300'>Readiness</p>
                  <p className='mt-2 text-3xl font-bold text-white'>
                    {(selectedFile ? 1 : 0) + (hasJobDescription ? 1 : 0)}/2
                  </p>
                  <p className='mt-1 text-xs text-slate-300'>Inputs provided</p>
                </div>
                <div className='rounded-lg border border-white/10 bg-white/[0.08] p-5'>
                  <p className='text-xs font-bold uppercase tracking-[0.1em] text-teal-200'>Latest Score</p>
                  <p className='mt-2 text-3xl font-bold text-white'>{overallScore ?? '--'}</p>
                  <p className='mt-1 text-xs text-slate-300'>ATS compatibility</p>
                </div>
              </div>
            </div>

            <div className='mt-8 grid gap-6 xl:grid-cols-2'>
              <div className='min-w-0 rounded-lg border border-white/10 bg-white p-5 text-[#0f172a] shadow-xl shadow-black/10'>
                <label
                  htmlFor='resume-upload'
                  className={`upload-dropzone group flex w-full min-w-0 min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-all ${
                    selectedFile
                      ? 'border-[#0f766e]/55 bg-[#0f766e]/5'
                      : 'border-[#cbd5e1] hover:border-[#0f766e] hover:bg-[#0f766e]/5'
                  }`}
                >
                  <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-[#0f766e]/10 text-[#0f766e] shadow-sm transition-transform group-hover:scale-110'>
                    {selectedFile ? <FileCheck size={28} strokeWidth={2} /> : <UploadCloud size={28} strokeWidth={2} />}
                  </div>

                  <h2 className='mt-5 text-xl font-semibold text-[#0f172a]'>
                    {selectedFile ? 'Resume ready for ATS analysis' : 'Drop your resume here'}
                  </h2>
                  <p className='mt-2 text-sm text-[#475569]'>
                    {selectedFile ? 'Click to replace the selected document' : 'Drag and drop your file here or click to browse'}
                  </p>
                  <p className='mt-2 text-xs font-medium uppercase tracking-wider text-[#475569]/80'>PDF / DOCX - Max 2 MB</p>
                  <input
                    id='resume-upload'
                    type='file'
                    className='hidden'
                    accept='.pdf,.docx'
                    onChange={handleFileChange}
                  />
                </label>

                {uploadStatus && (
                  <div className='mt-4 rounded-lg border border-black/5 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between gap-4'>
                      <div className='flex min-w-0 items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]'>
                          <FileText size={18} />
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-[#0f172a]'>{uploadStatus.name}</p>
                          <p className='text-xs text-[#475569]'>{loading ? 'Uploading and reading file...' : `${uploadStatus.size} selected`}</p>
                        </div>
                      </div>
                      {loading ? (
                        <LoaderCircle size={18} className='shrink-0 animate-spin text-[#0f766e]' />
                      ) : (
                        <CheckCircle2 size={18} className='shrink-0 text-[#0f766e]' />
                      )}
                    </div>
                    <div className='progress-track mt-4'>
                      <div className={`progress-bar ${loading ? 'progress-bar-indeterminate' : 'w-full'}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className='min-w-0 flex flex-col rounded-lg border border-white/10 bg-white p-5 text-[#0f172a] shadow-xl shadow-black/10'>
                <div className='flex items-start gap-3 mb-4'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f172a]/5 text-[#0f172a]'>
                    <Target size={18} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h2 className='text-lg font-semibold text-[#0f172a]'>Target Job Description</h2>
                    <p className='text-xs text-[#475569] mt-0.5'>Paste the role requirements to compare against.</p>
                  </div>
                  {!hasJobDescription && (
                    <button
                      type='button'
                      onClick={handleUseSampleRole}
                      className='shrink-0 whitespace-nowrap rounded-lg border border-black/10 bg-[#f8fafc] px-3 py-2 text-xs font-semibold text-[#0f172a] shadow-sm hover:-translate-y-0.5 hover:border-[#0f766e]/35'
                    >
                      Use sample
                    </button>
                  )}
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder='Paste the job title, responsibilities, required skills, and qualifications here...'
                  className='app-textarea flex-1 w-full min-w-0 text-sm bg-white border-black/10 focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] shadow-sm'
                  style={{ minHeight: '220px' }}
                />

                {hasJobDescription && (
                  <div className='mt-4 flex items-center gap-2 text-xs font-semibold text-[#0f766e]'>
                    <CheckCircle2 size={14} /> Job description captured
                  </div>
                )}
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-end'>
              <button
                type='button'
                onClick={handleClearInputs}
                className='inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15 sm:w-auto'
              >
                Clear inputs
              </button>
              <button
                onClick={handleUpload}
                type='button'
                disabled={loading || !selectedFile || !hasJobDescription}
                className='btn-primary w-full min-w-[220px] py-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <LoaderCircle className='animate-spin' size={18} />
                ) : (
                  <FileCheck size={18} />
                )}
                {loading ? 'Analyzing...' : 'Run ATS Analysis'}
              </button>
            </div>

            {loading && (
              <div className='mt-6 rounded-lg border border-teal-300/20 bg-teal-300/10 p-5'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#0f766e] shadow-sm'>
                    <LoaderCircle className='animate-spin' size={20} />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-white'>Analysis in progress</p>
                    <p className='mt-1 text-xs text-slate-300'>ResumeLens is turning your file into role-specific feedback.</p>
                  </div>
                </div>

                <div className='mt-4 grid gap-3 md:grid-cols-3'>
                  {analysisSteps.map((step) => (
                    <div key={step} className='analysis-step-line rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white'>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {!analysis && !loading && (
            <section className='mt-6 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]'>
              <div className='surface-card p-6'>
                <p className='text-xs font-bold uppercase tracking-[0.16em] text-[#64748b]'>Report preview</p>
                <h2 className='mt-3 text-2xl font-bold text-[#0f172a]'>What you will get after ATS analysis</h2>
                <p className='mt-3 text-sm leading-7 text-[#64748b]'>
                  The analyzer turns your resume and job description into a focused report with score, keyword gaps, and suggested edits.
                </p>

                <div className='mt-6 space-y-3'>
                  {['ATS compatibility score', 'Matched and missing role keywords', 'Actionable resume improvement cards'].map((item) => (
                    <div key={item} className='flex items-center gap-3 rounded-lg border border-black/10 bg-[#f8fafc] p-3'>
                      <CheckCircle2 size={17} className='text-[#0f766e]' />
                      <span className='text-sm font-semibold text-[#0f172a]'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='surface-card overflow-hidden p-0'>
                <div className='border-b border-black/10 bg-[#0f172a] px-5 py-4 text-white'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='text-xs font-bold uppercase tracking-[0.16em] text-teal-200'>ATS report shell</p>
                      <h3 className='mt-1 text-xl font-bold'>Waiting for resume input</h3>
                    </div>
                    <span className='rounded-md bg-white/10 px-3 py-1 text-sm font-bold'>Preview</span>
                  </div>
                </div>

                <div className='grid gap-5 p-5 lg:grid-cols-[220px_1fr]'>
                  <div className='rounded-lg border border-black/10 bg-[#f8fafc] p-5 text-center'>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]'>Score</p>
                    <div className='mx-auto mt-5 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-[#dbeafe] bg-white'>
                      <span className='text-4xl font-extrabold text-[#94a3b8]'>--</span>
                    </div>
                    <p className='mt-4 text-sm text-[#64748b]'>Upload a resume to calculate compatibility.</p>
                  </div>

                  <div className='space-y-4'>
                    {[
                      ['Keyword analysis', 'Matched and missing terms will appear here.'],
                      ['Content feedback', 'Suggestions will be grouped into clear improvement priorities.'],
                      ['Formatting status', 'Parsing confirmation will show once the file is processed.']
                    ].map(([title, copy]) => (
                      <div key={title} className='rounded-lg border border-black/10 bg-white p-4 shadow-sm'>
                        <p className='text-sm font-bold text-[#0f172a]'>{title}</p>
                        <p className='mt-1 text-sm text-[#64748b]'>{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {analysis && (
            <section className='mt-8'>
              <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <h2 className='text-2xl font-bold text-[#0f172a]'>ATS Analysis Results</h2>
                
                <div className='flex overflow-x-auto max-w-full hide-scrollbar bg-white rounded-xl p-1 shadow-sm border border-black/5'>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab 
                          ? 'bg-[#f0f2f5] text-[#0f172a] shadow-sm' 
                          : 'text-[#475569] hover:text-[#0f172a] hover:bg-black/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mb-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]'>
                <div className='saas-panel-dark rounded-lg p-6'>
                  <p className='text-xs font-bold uppercase tracking-[0.16em] text-teal-200'>1. ATS Score</p>
                  <div className='mt-5 flex items-end justify-between gap-4'>
                    <div>
                      <p className='text-6xl font-extrabold text-white'>{overallScore ?? 0}</p>
                      <p className='mt-2 text-sm font-semibold text-slate-300'>Overall compatibility out of 100</p>
                    </div>
                    <div className='h-24 w-24 rounded-full border-[10px] border-teal-300/25 bg-teal-300/10' />
                  </div>
                  <div className='progress-track mt-6 bg-white/10'>
                    <div className='progress-bar' style={{ width: `${overallScore ?? 0}%` }} />
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-3'>
                  <div className='surface-card p-5'>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]'>2. Matched vs Missing</p>
                    <div className='mt-4 flex items-center gap-3'>
                      <span className='rounded-lg bg-[#0f766e]/10 px-3 py-2 text-lg font-extrabold text-[#0f766e]'>{analysis.matchedKeywords?.length ?? 0}</span>
                      <span className='text-sm font-semibold text-[#64748b]'>matched</span>
                    </div>
                    <div className='mt-3 flex items-center gap-3'>
                      <span className='rounded-lg bg-[#f0b56a]/15 px-3 py-2 text-lg font-extrabold text-[#b7791f]'>{analysis.missingKeywords?.length ?? 0}</span>
                      <span className='text-sm font-semibold text-[#64748b]'>missing</span>
                    </div>
                  </div>

                  <div className='surface-card p-5'>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]'>3. Suggestions</p>
                    <p className='mt-4 text-4xl font-extrabold text-[#0f172a]'>{analysis.suggestions?.length ?? 0}</p>
                    <p className='mt-2 text-sm leading-6 text-[#64748b]'>actionable resume edits generated</p>
                  </div>

                  <div className='surface-card p-5'>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]'>4. Breakdown</p>
                    <div className='mt-4 space-y-3'>
                      {categoryScores.slice(0, 3).map((item) => (
                        <div key={item.title}>
                          <div className='mb-1 flex justify-between gap-3 text-xs font-bold text-[#64748b]'>
                            <span>{item.title}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className='h-1.5 rounded-full bg-[#e2e8f0]'>
                            <div className='h-full rounded-full bg-[#0f766e]' style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='surface-card overflow-hidden rounded-[24px] shadow-md border-black/5 min-h-[400px]'>
                {activeTab === 'ATS Score' && (
                  <div className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr] p-6 sm:p-8'>
                    <div className='flex flex-col items-center justify-center bg-[#f8f9fa] rounded-[20px] p-8 border border-black/5'>
                      <p className='text-sm text-[#475569] font-medium'>Detailed breakdown of ATS score will be displayed here.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default AnalysisPage