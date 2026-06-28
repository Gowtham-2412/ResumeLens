import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const [redirectTo, setRedirectTo] = useState('')
  const hasProcessedRef = useRef(false)
  const { setAuthSession } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasProcessedRef.current) return

    hasProcessedRef.current = true
    const token = searchParams.get('token')

    if (!token) {
      setError('Google sign-in did not return a valid token.')
      return
    }

    try {
      const nextUser = setAuthSession(token)
      setRedirectTo(`/${nextUser.id}`)
    } catch {
      setError('Unable to finish Google sign-in. Please try again.')
    }
  }, [searchParams, setAuthSession])

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className='page-shell flex min-h-screen items-center justify-center py-10'>
      <div className='surface-card w-full max-w-md p-8 text-center'>
        {error ? (
          <>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger-light text-danger'>
              <AlertCircle size={22} />
            </div>
            <h1 className='mt-4 font-display text-2xl font-bold text-ink'>Sign-in failed</h1>
            <p className='mt-2 text-sm text-graphite'>{error}</p>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-secondary mt-5'
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-signal-light text-signal'>
              <LoaderCircle className='animate-spin' size={22} />
            </div>
            <h1 className='mt-4 font-display text-2xl font-bold text-ink'>Signing you in</h1>
            <p className='mt-2 text-sm text-graphite'>
              Finishing your Google authentication...
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthSuccessPage
