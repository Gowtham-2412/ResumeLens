import React, { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  LoaderCircle,
  Sparkles,
  Trash2,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAnalysis } from '../../context/AnalysisContext'

const getPrimaryTitle = (item) => {
  if (item?.resumeFile) {
    return item.resumeFile.replace(/\.[^.]+$/, '')
  }

  return 'ATS analysis'
}

const getDescriptionPreview = (text) => {
  if (!text?.trim()) {
    return 'No job description saved for this ATS analysis.'
  }

  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > 170 ? `${normalized.slice(0, 167)}...` : normalized
}

const formatAnalysisDate = (value) => {
  if (!value) return 'No date available'

  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const HistoryPage = () => {
  const navigate = useNavigate()
  const {
    history,
    loading,
    error,
    fetchHistory,
    fetchAnalysisById,
    deleteAnalysis
  } = useAnalysis()
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [openingAnalysisId, setOpeningAnalysisId] = useState(null)
  const [deletingAnalysisId, setDeletingAnalysisId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const fetchHistoryRef = useRef(fetchHistory)

  fetchHistoryRef.current = fetchHistory

  useEffect(() => {
    let isActive = true

    const loadHistory = async () => {
      try {
        await fetchHistoryRef.current()
      } catch {
        // Error state is already exposed through context.
      } finally {
        if (isActive) {
          setIsBootstrapping(false)
        }
      }
    }

    loadHistory()

    return () => {
      isActive = false
    }
  }, [])

  const handleOpenAnalysis = async (id) => {
    if (!id) return

    setOpeningAnalysisId(id)

    try {
      await fetchAnalysisById(id)
      navigate('/analyze')
    } catch {
      // Error state is already handled by context.
    } finally {
      setOpeningAnalysisId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete?._id) return

    setDeletingAnalysisId(pendingDelete._id)

    try {
      await deleteAnalysis(pendingDelete._id)
      setPendingDelete(null)
    } catch {
      // Error state is already handled by context.
    } finally {
      setDeletingAnalysisId(null)
    }
  }

  return (
    <div className='min-h-screen text-text-primary'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-6 sm:pt-8'>
          <section className='surface-card rounded-[34px] p-6 sm:p-8'>
            <div className='flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between'>
              <div className='max-w-2xl'>
                <div className='eyebrow'>
                  <Sparkles size={14} />
                  Saved reviews
                </div>
                <h1 className='mt-5 text-3xl font-semibold sm:text-4xl'>History</h1>
                <p className='mt-3 text-sm leading-7 text-light-gray-text sm:text-base'>
                  Reopen any saved ATS analysis, review the role-specific context, and continue refining without losing your previous work.
                </p>
              </div>

              <button
                type='button'
                onClick={() => navigate('/analyze')}
                className='btn-primary'
              >
                Run ATS Analysis
                <ArrowRight size={18} />
              </button>
            </div>

            {error && (
              <div className='mt-6 flex items-center gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200'>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <section className='mt-8'>
              <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <h2 className='text-2xl font-semibold'>Your ATS analyses</h2>
                  <p className='mt-1 text-sm leading-6 text-light-gray-text'>
                    A cleaner visual archive of resume comparisons and ATS results.
                  </p>
                </div>
                <p className='text-sm text-light-gray-text'>{history.length} saved item{history.length === 1 ? '' : 's'}</p>
              </div>

              {loading && isBootstrapping ? (
                <div className='grid gap-4 lg:grid-cols-2'>
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className='surface-card-muted animate-pulse rounded-[26px] p-6'
                    >
                      <div className='h-5 w-1/3 rounded-sm bg-white/10' />
                      <div className='mt-4 h-4 w-full rounded-sm bg-white/10' />
                      <div className='mt-2 h-4 w-5/6 rounded-sm bg-white/10' />
                      <div className='mt-6 h-10 w-32 rounded-xl bg-white/10' />
                    </div>
                  ))}
                </div>
              ) : history.length ? (
                <div className='grid gap-4 lg:grid-cols-2'>
                  {history.map((item) => (
                    <article
                      key={item._id}
                      className='surface-card-muted group rounded-[28px] p-6 transition hover:-translate-y-1'
                    >
                      <div className='flex h-full flex-col justify-between gap-5'>
                        <div>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='rounded-full border border-button-background/20 bg-button-background/10 px-3 py-1 text-sm font-semibold text-button-background'>
                              ATS {item.atsScore ?? 0}%
                            </span>
                            <span className='badge-soft'>{formatAnalysisDate(item.createdAt)}</span>
                          </div>

                          <h3 className='mt-5 text-xl font-semibold'>{getPrimaryTitle(item)}</h3>
                          <p className='mt-3 text-sm leading-7 text-light-gray-text'>
                            {getDescriptionPreview(item.jobDescription)}
                          </p>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex flex-wrap gap-2 text-sm text-light-gray-text'>
                            <span className='rounded-full border border-white/10 bg-white/[0.03] px-3 py-1'>
                              {item.matchedKeywords?.length ?? 0} matched
                            </span>
                            <span className='rounded-full border border-white/10 bg-white/[0.03] px-3 py-1'>
                              {item.missingKeywords?.length ?? 0} missing
                            </span>
                            <span className='rounded-full border border-white/10 bg-white/[0.03] px-3 py-1'>
                              {item.suggestions?.length ?? 0} suggestions
                            </span>
                          </div>

                          <button
                            type='button'
                            onClick={() => handleOpenAnalysis(item._id)}
                            disabled={openingAnalysisId === item._id}
                            className='btn-secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60'
                          >
                            {openingAnalysisId === item._id && <LoaderCircle className='animate-spin' size={18} />}
                            Open ATS Analysis
                          </button>
                          <button
                            type='button'
                            onClick={() => setPendingDelete(item)}
                            disabled={deletingAnalysisId === item._id}
                            className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                          >
                            {deletingAnalysisId === item._id ? <LoaderCircle className='animate-spin' size={18} /> : <Trash2 size={18} />}
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className='surface-card-muted rounded-[28px] py-14 text-center'>
                  <div className='mx-auto max-w-md px-6'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-button-background/10 text-button-background'>
                      <ClipboardList size={26} />
                    </div>
                    <h3 className='mt-5 text-2xl font-semibold'>No history yet</h3>
                    <p className='mx-auto mt-3 text-sm leading-7 text-light-gray-text'>
                      Run your first ATS analysis and it will show up here for quick access later.
                    </p>
                    <button
                      type='button'
                      onClick={() => navigate('/analyze')}
                      className='btn-primary mt-6'
                    >
                      Run ATS Analysis
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </section>
        </main>
      </div>

      {pendingDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 px-4 backdrop-blur-sm'>
          <div className='surface-card w-full max-w-md p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.16em] text-red-500'>Delete analysis</p>
                <h2 className='mt-3 text-2xl font-bold text-[#0f172a]'>Remove this saved ATS analysis?</h2>
              </div>
              <button
                type='button'
                onClick={() => setPendingDelete(null)}
                className='rounded-lg border border-black/10 bg-[#f8fafc] p-2 text-[#475569] hover:text-[#0f172a]'
              >
                <X size={18} />
              </button>
            </div>

            <p className='mt-4 text-sm leading-7 text-[#64748b]'>
              This will permanently delete <span className='font-semibold text-[#0f172a]'>{getPrimaryTitle(pendingDelete)}</span> from your history. This action cannot be undone.
            </p>

            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() => setPendingDelete(null)}
                className='btn-secondary'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                disabled={deletingAnalysisId === pendingDelete._id}
                className='inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {deletingAnalysisId === pendingDelete._id && <LoaderCircle className='animate-spin' size={18} />}
                Delete analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
