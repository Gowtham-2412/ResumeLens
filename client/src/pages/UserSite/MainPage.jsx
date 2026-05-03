import React, { useEffect, useMemo, useRef } from 'react'
import {
  ArrowRight,
  BarChart3,
  Clock3,
  FileSearch,
  FileText,
  Plus,
  Target,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAnalysis } from '../../context/AnalysisContext'
import { useAuth } from '../../context/AuthContext'

const focusItems = [
  'Compare each resume against one target role',
  'Rewrite missing skills into relevant project bullets',
  'Rerun the analyzer after every meaningful revision'
]

const formatAnalysisDate = (value) => {
  if (!value) return 'Recently'
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getPrimaryTitle = (item) => {
  if (item?.resumeFile) return item.resumeFile.replace(/\.[^.]+$/, '')
  return 'ATS analysis'
}

const MainPage = () => {
  const { user } = useAuth()
  const { history, fetchHistory } = useAnalysis()
  const navigate = useNavigate()
  const fetchHistoryRef = useRef(fetchHistory)

  fetchHistoryRef.current = fetchHistory

  useEffect(() => {
    fetchHistoryRef.current().catch(() => {
      // Dashboard still works without history.
    })
  }, [])

  const displayName = user?.username || user?.name || user?.email?.split('@')[0] || 'Member'

  const quickStats = useMemo(() => {
    const totalAnalyses = history.length
    const bestScore = totalAnalyses ? Math.max(...history.map((item) => item.atsScore ?? 0)) : 0
    const averageScore = totalAnalyses
      ? Math.round(history.reduce((sum, item) => sum + (item.atsScore ?? 0), 0) / totalAnalyses)
      : 0
    const totalMissing = history.reduce((sum, item) => sum + (item.missingKeywords?.length ?? 0), 0)

    return [
      { label: 'Saved analyses', value: totalAnalyses.toString(), note: 'Role reviews stored', icon: FileText },
      { label: 'Best ATS score', value: `${bestScore}%`, note: 'Highest match so far', icon: Target },
      { label: 'Average match', value: `${averageScore}%`, note: 'Across all analyses', icon: BarChart3 },
      { label: 'Open keyword gaps', value: totalMissing.toString(), note: 'Terms to improve', icon: TrendingUp }
    ]
  }, [history])

  const recentAnalyses = useMemo(() => history.slice(0, 4), [history])

  return (
    <div className='min-h-screen text-text-primary'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-4'>
          <section className='saas-panel-dark overflow-hidden rounded-lg p-6 sm:p-8'>
            <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
              <div>
                <div className='inline-flex rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-100'>
                  Workspace overview
                </div>
                <h1 className='mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl'>
                  Track and improve your resume performance.
                </h1>
                <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
                  Welcome back, {displayName}. ResumeLens turns each job application into a measurable workflow: analyze, revise, compare, and keep the best version moving forward.
                </p>

                <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                  <button
                    type='button'
                    onClick={() => navigate('/analyze')}
                    className='inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-teal-50'
                  >
                    <Plus size={18} />
                    Run ATS Analysis
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate('/history')}
                    className='inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15'
                  >
                    View history
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className='rounded-lg border border-white/10 bg-white/[0.06] p-5'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs font-bold uppercase tracking-[0.18em] text-slate-300'>Recommended flow</p>
                  <FileSearch size={18} className='text-teal-200' />
                </div>
                <div className='mt-5 space-y-3'>
                  {focusItems.map((item, index) => (
                    <div key={item} className='flex gap-3 rounded-md bg-white/[0.06] p-3'>
                      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-300/12 text-sm font-bold text-teal-100'>
                        {index + 1}
                      </span>
                      <p className='text-sm leading-6 text-slate-200'>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className='mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            {quickStats.map(({ label, value, note, icon: Icon }) => (
              <div key={label} className='surface-card interactive-card p-5'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]'>{label}</p>
                    <h2 className='mt-3 text-3xl font-extrabold text-[#0f172a]'>{value}</h2>
                  </div>
                  <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#0f766e]/10 text-[#0f766e]'>
                    <Icon size={20} />
                  </div>
                </div>
                <p className='mt-4 text-sm font-medium text-[#64748b]'>{note}</p>
              </div>
            ))}
          </section>

          <section className='mt-5 grid gap-5 xl:grid-cols-[1fr_360px]'>
            <div className='surface-card p-5 sm:p-6'>
              <div className='flex flex-col gap-3 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-[#0f172a]'>Recent resume reviews</h2>
                  <p className='mt-1 text-sm text-[#64748b]'>Your latest comparisons, scores, and role context.</p>
                </div>
                <button type='button' onClick={() => navigate('/history')} className='btn-secondary'>
                  See all
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className='mt-5 space-y-3'>
                {recentAnalyses.length ? recentAnalyses.map((analysis) => (
                  <button
                    type='button'
                    key={analysis._id}
                    onClick={() => navigate('/history')}
                    className='saas-table-row grid w-full gap-4 rounded-lg p-4 text-left md:grid-cols-[1fr_110px_130px]'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-bold text-[#0f172a]'>{getPrimaryTitle(analysis)}</p>
                      <p className='mt-1 line-clamp-1 text-sm text-[#64748b]'>
                        {analysis.jobDescription || 'No job description preview available.'}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]'>Score</p>
                      <p className='mt-1 text-sm font-extrabold text-[#0f766e]'>{analysis.atsScore ?? 0}%</p>
                    </div>
                    <div>
                      <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]'>Updated</p>
                      <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a]'>
                        <Clock3 size={14} />
                        {formatAnalysisDate(analysis.createdAt)}
                      </p>
                    </div>
                  </button>
                )) : (
                  <div className='rounded-lg border border-dashed border-black/15 bg-[#f8fafc] p-8 text-center'>
                    <p className='text-lg font-bold text-[#0f172a]'>No saved ATS analyses yet</p>
                    <p className='mt-2 text-sm leading-6 text-[#64748b]'>Run your first ATS comparison and your dashboard will populate with real score history.</p>
                    <button type='button' onClick={() => navigate('/analyze')} className='btn-primary mt-5'>
                      Run ATS Analysis
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className='surface-card p-5 sm:p-6'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-[#64748b]'>Improvement signal</p>
              <h2 className='mt-3 text-2xl font-bold text-[#0f172a]'>Prioritize role language.</h2>
              <p className='mt-3 text-sm leading-7 text-[#64748b]'>
                The highest-impact edits usually come from adding missing job-specific technologies, action verbs, and measurable results.
              </p>

              <div className='mt-6 space-y-4'>
                {[
                  ['Keyword coverage', 'Mirror the exact tools from the posting.'],
                  ['Achievement proof', 'Add numbers where outcomes are vague.'],
                  ['Version control', 'Keep one resume version per target role.']
                ].map(([title, copy]) => (
                  <div key={title} className='rounded-lg border border-black/10 bg-[#f8fafc] p-4'>
                    <p className='text-sm font-bold text-[#0f172a]'>{title}</p>
                    <p className='mt-1 text-sm leading-6 text-[#64748b]'>{copy}</p>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}

export default MainPage
