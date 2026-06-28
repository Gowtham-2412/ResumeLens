import React, { useEffect, useMemo, useRef } from 'react'
import {
  ArrowRight,
  BarChart3,
  Clock3,
  FileText,
  Plus,
  Target,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ScoreRing from '../../components/ScoreRing'
import { useAnalysis } from '../../context/AnalysisContext'
import { useAuth } from '../../context/AuthContext'

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
    fetchHistoryRef.current().catch(() => {})
  }, [])

  const displayName = user?.username || user?.name || user?.email?.split('@')[0] || 'Member'

  const quickStats = useMemo(() => {
    const totalAnalyses = history.length
    const bestScore = totalAnalyses ? Math.max(...history.map((item) => item.atsScore ?? 0)) : 0
    const averageScore = totalAnalyses
      ? Math.round(history.reduce((sum, item) => sum + (item.atsScore ?? 0), 0) / totalAnalyses)
      : 0
    const totalMissing = history.reduce((sum, item) => sum + (item.missingKeywords?.length ?? 0), 0)

    return { totalAnalyses, bestScore, averageScore, totalMissing }
  }, [history])

  const recentAnalyses = useMemo(() => history.slice(0, 5), [history])

  return (
    <div className='min-h-screen'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-4'>
          <section className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='font-display text-2xl font-bold text-ink sm:text-3xl'>
                Welcome back, {displayName}
              </h1>
              <p className='mt-1 text-graphite'>
                Track your resume performance and keep improving.
              </p>
            </div>
            <button
              type='button'
              onClick={() => navigate('/analyze')}
              className='btn-primary shrink-0 px-5 py-2.5'
            >
              <Plus size={17} />
              New Analysis
            </button>
          </section>

          <section className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='surface-card p-5'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Analyses</p>
                  <p className='mt-2 font-display text-3xl font-bold text-ink'>{quickStats.totalAnalyses}</p>
                </div>
                <div className='rounded-lg bg-signal-light p-2 text-signal'>
                  <FileText size={18} />
                </div>
              </div>
              <p className='mt-3 text-sm text-graphite'>Saved reviews</p>
            </div>

            <div className='surface-card p-5'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Best Score</p>
                  <p className='mt-2 font-display text-3xl font-bold text-ink'>{quickStats.bestScore}%</p>
                </div>
                <div className='rounded-lg bg-signal-light p-2 text-signal'>
                  <Target size={18} />
                </div>
              </div>
              <p className='mt-3 text-sm text-graphite'>Highest match so far</p>
            </div>

            <div className='surface-card p-5'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Average</p>
                  <p className='mt-2 font-display text-3xl font-bold text-ink'>{quickStats.averageScore}%</p>
                </div>
                <div className='rounded-lg bg-signal-light p-2 text-signal'>
                  <BarChart3 size={18} />
                </div>
              </div>
              <p className='mt-3 text-sm text-graphite'>Across all analyses</p>
            </div>

            <div className='surface-card p-5'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>Keyword Gaps</p>
                  <p className='mt-2 font-display text-3xl font-bold text-ink'>{quickStats.totalMissing}</p>
                </div>
                <div className='rounded-lg bg-missing-light p-2 text-missing'>
                  <TrendingUp size={18} />
                </div>
              </div>
              <p className='mt-3 text-sm text-graphite'>Terms to address</p>
            </div>
          </section>

          <section className='mt-6'>
            <div className='surface-card overflow-hidden'>
              <div className='flex items-center justify-between border-b border-rule px-5 py-4 sm:px-6'>
                <div>
                  <h2 className='font-display text-lg font-bold text-ink'>Recent Analyses</h2>
                  <p className='mt-0.5 text-sm text-graphite'>Your latest resume comparisons and scores.</p>
                </div>
                {recentAnalyses.length > 0 && (
                  <button type='button' onClick={() => navigate('/history')} className='btn-ghost text-sm text-signal'>
                    View all
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              {recentAnalyses.length > 0 ? (
                <div className='divide-y divide-rule'>
                  {recentAnalyses.map((analysis) => (
                    <button
                      type='button'
                      key={analysis._id}
                      onClick={() => navigate('/history')}
                      className='flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-canvas sm:px-6'
                    >
                      <ScoreRing score={analysis.atsScore ?? 0} size={44} strokeWidth={4} />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-semibold text-ink'>{getPrimaryTitle(analysis)}</p>
                        <p className='mt-0.5 line-clamp-1 text-sm text-graphite'>
                          {analysis.jobDescription || 'No description available.'}
                        </p>
                      </div>
                      <div className='hidden shrink-0 text-right sm:block'>
                        <p className='flex items-center gap-1.5 text-sm text-graphite'>
                          <Clock3 size={13} />
                          {formatAnalysisDate(analysis.createdAt)}
                        </p>
                      </div>
                      <ArrowRight size={16} className='shrink-0 text-graphite/40' />
                    </button>
                  ))}
                </div>
              ) : (
                <div className='px-6 py-14 text-center'>
                  <p className='font-display text-lg font-bold text-ink'>No analyses yet</p>
                  <p className='mt-2 text-sm text-graphite'>
                    Run your first ATS comparison and your dashboard will populate with score history.
                  </p>
                  <button type='button' onClick={() => navigate('/analyze')} className='btn-primary mt-5'>
                    Run ATS Analysis
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default MainPage
