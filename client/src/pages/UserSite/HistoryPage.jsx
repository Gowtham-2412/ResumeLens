import React, { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  LoaderCircle,
  Trash2,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ScoreRing from '../../components/ScoreRing'
import { useAnalysis } from '../../context/AnalysisContext'

const getPrimaryTitle = (item) => {
  if (item?.resumeFile) return item.resumeFile.replace(/\.[^.]+$/, '')
  return 'ATS analysis'
}

const formatAnalysisDate = (value) => {
  if (!value) return 'No date'
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
      } finally {
        if (isActive) setIsBootstrapping(false)
      }
    }

    loadHistory()
    return () => { isActive = false }
  }, [])

  const handleOpenAnalysis = async (id) => {
    if (!id) return
    setOpeningAnalysisId(id)
    try {
      await fetchAnalysisById(id)
      navigate('/analyze')
    } catch {
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
    } finally {
      setDeletingAnalysisId(null)
    }
  }

  return (
    <div className='min-h-screen'>
      <div className='page-shell'>
        <Navbar />

        <main className='pb-14 pt-4'>
          <section className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='font-display text-2xl font-bold text-ink sm:text-3xl'>Analysis History</h1>
              <p className='mt-1 text-graphite'>
                Reopen any saved analysis and continue refining.
              </p>
            </div>
            <div className='flex items-center gap-3'>
              {history.length > 0 && (
                <span className='rounded-md bg-canvas px-2.5 py-1 text-sm font-medium text-graphite'>
                  {history.length} saved
                </span>
              )}
              <button type='button' onClick={() => navigate('/analyze')} className='btn-primary'>
                New Analysis
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {error && (
            <div className='mt-4 flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger'>
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <section className='mt-6'>
            {loading && isBootstrapping ? (
              <div className='surface-card divide-y divide-rule overflow-hidden'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='flex items-center gap-4 px-5 py-5 sm:px-6'>
                    <div className='h-11 w-11 animate-pulse rounded-full bg-canvas' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 w-1/3 animate-pulse rounded bg-canvas' />
                      <div className='h-3 w-2/3 animate-pulse rounded bg-canvas' />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className='surface-card divide-y divide-rule overflow-hidden'>
                {history.map((item) => (
                  <div
                    key={item._id}
                    className='flex items-center gap-4 px-5 py-4 sm:px-6'
                  >
                    <ScoreRing score={item.atsScore ?? 0} size={48} strokeWidth={4} />

                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-semibold text-ink'>{getPrimaryTitle(item)}</p>
                      <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-graphite'>
                        <span>{formatAnalysisDate(item.createdAt)}</span>
                        <span>{item.matchedKeywords?.length ?? 0} matched</span>
                        <span>{item.missingKeywords?.length ?? 0} missing</span>
                      </div>
                    </div>

                    <div className='flex shrink-0 items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => handleOpenAnalysis(item._id)}
                        disabled={openingAnalysisId === item._id}
                        className='btn-secondary py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {openingAnalysisId === item._id ? (
                          <LoaderCircle className='animate-spin' size={15} />
                        ) : null}
                        Open
                      </button>
                      <button
                        type='button'
                        onClick={() => setPendingDelete(item)}
                        disabled={deletingAnalysisId === item._id}
                        className='rounded-lg border border-rule p-2 text-graphite hover:border-danger/30 hover:bg-danger-light hover:text-danger disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {deletingAnalysisId === item._id ? (
                          <LoaderCircle className='animate-spin' size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='surface-card px-6 py-16 text-center'>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-signal-light text-signal'>
                  <ClipboardList size={24} />
                </div>
                <h3 className='mt-4 font-display text-lg font-bold text-ink'>No history yet</h3>
                <p className='mt-2 text-sm text-graphite'>
                  Run your first ATS analysis and it will appear here.
                </p>
                <button type='button' onClick={() => navigate('/analyze')} className='btn-primary mt-5'>
                  Run ATS Analysis
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {pendingDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm'>
          <div className='surface-card w-full max-w-md p-6'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-widest text-danger'>Delete analysis</p>
                <h2 className='mt-2 font-display text-xl font-bold text-ink'>
                  Remove this analysis?
                </h2>
              </div>
              <button
                type='button'
                onClick={() => setPendingDelete(null)}
                className='rounded-lg border border-rule p-1.5 text-graphite hover:text-ink'
              >
                <X size={16} />
              </button>
            </div>

            <p className='mt-3 text-sm leading-relaxed text-graphite'>
              This will permanently delete{' '}
              <span className='font-semibold text-ink'>{getPrimaryTitle(pendingDelete)}</span>{' '}
              from your history. This cannot be undone.
            </p>

            <div className='mt-5 flex gap-3 sm:justify-end'>
              <button type='button' onClick={() => setPendingDelete(null)} className='btn-secondary flex-1 sm:flex-initial'>
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                disabled={deletingAnalysisId === pendingDelete._id}
                className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial'
              >
                {deletingAnalysisId === pendingDelete._id && <LoaderCircle className='animate-spin' size={15} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
