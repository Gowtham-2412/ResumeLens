import React, { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileCheck,
  FileText,
  LoaderCircle,
  Target,
  UploadCloud
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import ScoreRing from '../../components/ScoreRing'
import { useAnalysis } from '../../context/AnalysisContext'

const scoreColors = ['text-signal', 'text-amber-600', 'text-violet-600', 'text-ink']

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
    return { name: selectedFile.name, size: `${sizeInMb.toFixed(1)} MB` }
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
      { title: 'ATS Match Score', score: analysis.atsScore ?? 0, description: 'Overall alignment with the target role.' },
      { title: 'Keyword Match', score: keywordMatchScore, description: `${matchedCount} keywords successfully matched.` },
      { title: 'Missing Coverage', score: missingCoverageScore, description: `${missingCount} important terms are missing.` },
      { title: 'Content Quality', score: readinessScore, description: `${suggestionLoad} actionable suggestions found.` }
    ]
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
    if (!selectedFile || !jobDescription.trim()) return

    const formData = new FormData()
    formData.append('resume', selectedFile)
    formData.append('jobDescription', jobDescription.trim())

    try {
      await analyzeResume(formData)
      setActiveTab('ATS Score')
    } catch {
      // Error state handled by context.
    }
  }

  const tabs = ['ATS Score', 'Matched vs Missing', 'Suggestions', 'Breakdown']

  return (
    <div className='min-h-screen'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-4'>
          <section>
            <h1 className='font-display text-2xl font-bold text-ink sm:text-3xl'>ATS Analysis</h1>
            <p className='mt-1 text-graphite'>
              Upload your resume and paste the target job description to get started.
            </p>

            {error && (
              <div className='mt-4 flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger'>
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className='mt-6 grid gap-5 xl:grid-cols-2'>
            <div className='surface-card p-5'>
              <label
                htmlFor='resume-upload'
                className={`upload-dropzone group flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-10 text-center ${
                  selectedFile ? 'border-signal bg-signal-subtle' : ''
                }`}
              >
                <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-signal-light text-signal transition-transform group-hover:scale-105'>
                  {selectedFile ? <FileCheck size={24} /> : <UploadCloud size={24} />}
                </div>

                <h2 className='mt-4 font-display text-lg font-bold text-ink'>
                  {selectedFile ? 'Resume ready' : 'Drop your resume here'}
                </h2>
                <p className='mt-1.5 text-sm text-graphite'>
                  {selectedFile ? 'Click to replace the file' : 'or click to browse your files'}
                </p>
                <p className='mt-2 text-xs font-medium uppercase tracking-wider text-graphite/60'>
                  PDF / DOCX &mdash; Max 2 MB
                </p>
                <input
                  id='resume-upload'
                  type='file'
                  className='hidden'
                  accept='.pdf,.docx'
                  onChange={handleFileChange}
                />
              </label>

              {uploadStatus && (
                <div className='mt-4 flex items-center gap-3 rounded-lg border border-rule bg-canvas p-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal-light text-signal'>
                    <FileText size={16} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-ink'>{uploadStatus.name}</p>
                    <p className='text-xs text-graphite'>
                      {loading ? 'Processing...' : `${uploadStatus.size} selected`}
                    </p>
                  </div>
                  {loading ? (
                    <LoaderCircle size={17} className='shrink-0 animate-spin text-signal' />
                  ) : (
                    <CheckCircle2 size={17} className='shrink-0 text-matched' />
                  )}
                </div>
              )}
            </div>

            <div className='surface-card flex flex-col p-5'>
              <div className='mb-3 flex items-start gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-graphite'>
                  <Target size={17} />
                </div>
                <div className='min-w-0 flex-1'>
                  <h2 className='font-display text-base font-bold text-ink'>Job Description</h2>
                  <p className='text-xs text-graphite'>Paste the role requirements to compare against.</p>
                </div>
                {!hasJobDescription && (
                  <button
                    type='button'
                    onClick={handleUseSampleRole}
                    className='btn-ghost shrink-0 text-xs text-signal'
                  >
                    Use sample
                  </button>
                )}
              </div>

              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder='Paste the job title, responsibilities, required skills, and qualifications...'
                className='app-textarea flex-1 text-sm'
                style={{ minHeight: '220px' }}
              />

              {hasJobDescription && (
                <div className='mt-3 flex items-center gap-1.5 text-xs font-semibold text-matched'>
                  <CheckCircle2 size={13} /> Job description captured
                </div>
              )}
            </div>
          </section>

          <section className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
            <button type='button' onClick={handleClearInputs} className='btn-secondary'>
              Clear inputs
            </button>
            <button
              onClick={handleUpload}
              type='button'
              disabled={loading || !selectedFile || !hasJobDescription}
              className='btn-primary min-w-[200px] py-2.5 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? <LoaderCircle className='animate-spin' size={17} /> : <FileCheck size={17} />}
              {loading ? 'Analyzing...' : 'Run ATS Analysis'}
            </button>
          </section>

          {loading && (
            <section className='mt-5 rounded-xl border border-signal/20 bg-signal-subtle p-5'>
              <div className='flex items-center gap-3'>
                <LoaderCircle className='animate-spin text-signal' size={20} />
                <div>
                  <p className='text-sm font-semibold text-ink'>Analysis in progress</p>
                  <p className='mt-0.5 text-xs text-graphite'>Parsing your resume and comparing against the role...</p>
                </div>
              </div>
              <div className='mt-4 grid gap-2 sm:grid-cols-3'>
                {analysisSteps.map((step) => (
                  <div key={step} className='rounded-lg border border-rule bg-paper px-3 py-2 text-sm font-medium text-graphite'>
                    {step}
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysis && (
            <section className='mt-8'>
              <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h2 className='font-display text-xl font-bold text-ink'>Analysis Results</h2>
                <div className='flex overflow-x-auto rounded-lg border border-rule bg-canvas p-1'>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'bg-paper text-ink shadow-sm'
                          : 'text-graphite hover:text-ink'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className='surface-card min-h-[360px] overflow-hidden'>
                {activeTab === 'ATS Score' && (
                  <div className='grid gap-6 p-6 sm:p-8 lg:grid-cols-[280px_1fr]'>
                    <div className='flex flex-col items-center justify-center rounded-xl border border-rule bg-canvas p-8'>
                      <ScoreRing score={overallScore ?? 0} size={160} strokeWidth={12} label='ATS Match Score' />
                    </div>

                    <div className='grid gap-4 sm:grid-cols-3'>
                      <div className='rounded-xl border border-rule p-4'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Matched</p>
                        <p className='mt-2 font-display text-2xl font-bold text-matched'>
                          {analysis.matchedKeywords?.length ?? 0}
                        </p>
                        <p className='mt-1 text-xs text-graphite'>keywords found</p>
                      </div>
                      <div className='rounded-xl border border-rule p-4'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Missing</p>
                        <p className='mt-2 font-display text-2xl font-bold text-amber-600'>
                          {analysis.missingKeywords?.length ?? 0}
                        </p>
                        <p className='mt-1 text-xs text-graphite'>keywords to add</p>
                      </div>
                      <div className='rounded-xl border border-rule p-4'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Suggestions</p>
                        <p className='mt-2 font-display text-2xl font-bold text-ink'>
                          {analysis.suggestions?.length ?? 0}
                        </p>
                        <p className='mt-1 text-xs text-graphite'>improvements found</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Matched vs Missing' && (
                  <div className='grid gap-8 p-6 sm:p-8 md:grid-cols-2'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 size={17} className='text-matched' />
                        <h3 className='font-display font-bold text-ink'>Matched Keywords</h3>
                      </div>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {analysis.matchedKeywords?.length > 0 ? (
                          analysis.matchedKeywords.map((kw, i) => (
                            <span key={i} className='rounded-md bg-matched-light px-2.5 py-1 text-sm font-medium text-matched'>
                              {kw}
                            </span>
                          ))
                        ) : (
                          <p className='text-sm text-graphite'>No matched keywords found.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <AlertCircle size={17} className='text-amber-600' />
                        <h3 className='font-display font-bold text-ink'>Missing Keywords</h3>
                      </div>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {analysis.missingKeywords?.length > 0 ? (
                          analysis.missingKeywords.map((kw, i) => (
                            <span key={i} className='rounded-md bg-missing-light px-2.5 py-1 text-sm font-medium text-amber-700'>
                              {kw}
                            </span>
                          ))
                        ) : (
                          <p className='text-sm text-graphite'>No missing keywords found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Suggestions' && (
                  <div className='p-6 sm:p-8'>
                    <h3 className='font-display font-bold text-ink'>Improvement Suggestions</h3>
                    <div className='mt-5 space-y-3'>
                      {analysis.suggestions?.length > 0 ? (
                        analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className='flex items-start gap-3 rounded-lg border border-rule bg-canvas p-4'>
                            <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-light text-xs font-bold text-signal'>
                              {index + 1}
                            </span>
                            <p className='text-sm leading-relaxed text-graphite'>{suggestion}</p>
                          </div>
                        ))
                      ) : (
                        <p className='text-sm text-graphite'>No suggestions at this time.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'Breakdown' && (
                  <div className='p-6 sm:p-8'>
                    <h3 className='font-display font-bold text-ink'>Score Breakdown</h3>
                    <div className='mt-5 grid gap-5 sm:grid-cols-2'>
                      {categoryScores.map((item, index) => (
                        <div key={item.title} className='rounded-xl border border-rule bg-canvas p-5'>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm font-semibold text-ink'>{item.title}</p>
                            <span className={`font-display text-lg font-bold ${scoreColors[index % scoreColors.length]}`}>
                              {item.score}%
                            </span>
                          </div>
                          <div className='progress-track mt-3'>
                            <div className='progress-bar' style={{ width: `${item.score}%` }} />
                          </div>
                          <p className='mt-2 text-xs text-graphite'>{item.description}</p>
                        </div>
                      ))}
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
