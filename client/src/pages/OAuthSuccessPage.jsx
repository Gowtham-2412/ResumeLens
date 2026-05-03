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
    if (hasProcessedRef.current) {
      return
    }

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
      <div className='surface-card w-full max-w-lg rounded-[32px] p-8 text-center sm:p-10'>
        {error ? (
          <>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-300'>
              <AlertCircle size={24} />
            </div>
            <h1 className='mt-5 text-3xl font-semibold'>Google sign-in failed</h1>
            <p className='mt-3 text-sm leading-7 text-light-gray-text'>{error}</p>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-secondary mt-6'
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-button-background/10 text-button-background'>
              <LoaderCircle className='animate-spin' size={24} />
            </div>
            <h1 className='mt-5 text-3xl font-semibold'>Signing you in</h1>
            <p className='mt-3 text-sm leading-7 text-light-gray-text'>
              We are finishing your Google authentication and redirecting you into ResumeLens.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthSuccessPage
