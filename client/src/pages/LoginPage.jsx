import React, { useState } from 'react'
import { Home, LockKeyhole, Mail, Sparkles, User, WandSparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import google from '../assets/googlelogo.svg'
import { useAuth } from '../context/AuthContext'

const proofPoints = [
  'Upload your resume and compare it against a real role description',
  'See ATS score, missing keywords, and actionable improvement suggestions',
  'Keep a clean history of saved analyses inside one polished workspace'
]

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login, register, loginWithGoogle, loading } = useAuth()

  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleModeToggle = () => {
    setIsLogin((prev) => !prev)
    setError('')
  }

  const handleGoogleLogin = async () => {
    setError('')

    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google sign-in is unavailable right now.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        })
      } else {
        await register(formData)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete the request.')
    }
  }

  return (
    <div className='page-shell flex min-h-screen items-center py-8 sm:py-12'>
      <div className='grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
        <section className='surface-card relative hidden overflow-hidden rounded-[24px] p-6 lg:block xl:p-8 border-black/5'>
          <div className='absolute -right-8 top-8 h-36 w-36 rounded-full bg-[#0f766e]/10 blur-3xl' />
          <div className='absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-[#0f172a]/5 blur-3xl' />

          <button
            type='button'
            onClick={() => navigate('/')}
            className='badge-soft'
          >
            <Home size={14} />
            Back to home
          </button>

          <div className='mt-10 max-w-xl'>
            <div className='eyebrow'>
              <Sparkles size={14} />
              Professional resume workflow
            </div>
            <h1 className='mt-5 text-3xl font-bold leading-[1.1] sm:text-4xl text-[#0f172a]'>
              Look like a real product before the first analysis even starts.
            </h1>
          </div>

            <div className='mt-6 space-y-3'>
            {proofPoints.map((point) => (
              <div key={point} className='surface-card-muted rounded-[16px] p-4 bg-white border border-black/5'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/10 text-[#0f766e]'>
                    <WandSparkles size={14} />
                  </div>
                  <p className='text-sm leading-6 text-[#475569]'>{point}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='surface-card surface-card-raised relative rounded-[24px] p-6 sm:p-8 xl:p-8 border-black/5'>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='badge-soft bg-white border-black/5 text-[#475569] hover:text-[#0f172a] mb-6'
          >
            <Home size={14} />
            Back to home
          </button>

          <div className='space-y-2 text-center lg:text-left'>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]'>ResumeLens</p>
            <h1 className='text-2xl font-bold leading-tight sm:text-3xl text-[#0f172a]'>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className='text-sm leading-7 text-light-gray-text sm:text-base'>
              {isLogin
                ? 'Sign in to continue improving role-specific resumes and reopening previous analyses.'
                : 'Start using a cleaner, more polished workspace for ATS-focused resume refinement.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
            <button
              type='button'
              onClick={handleGoogleLogin}
              disabled={loading}
              className='btn-secondary w-full justify-center py-3.5 text-sm font-semibold'
            >
              <img src={google} alt='' className='w-5' />
              Continue with Google
            </button>

            <div className='flex items-center gap-3 py-2'>
              <div className='h-px flex-1 bg-black/5' />
              <p className='text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]'>or</p>
              <div className='h-px flex-1 bg-black/5' />
            </div>

            {!isLogin && (
              <div className='input-group has-icon'>
                <User size={15} className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-primary/45' />
                <input
                  id='username'
                  name='username'
                  type='text'
                  placeholder='Username'
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleChange}
                />
                <label htmlFor='username'>Username</label>
              </div>
            )}

            <div className='input-group has-icon'>
              <Mail size={15} className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-primary/45' />
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor='email'>Email</label>
            </div>

            <div className='input-group has-icon'>
              <LockKeyhole size={15} className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-primary/45' />
              <input
                id='password'
                type='password'
                name='password'
                placeholder='Password'
                required
                value={formData.password}
                onChange={handleChange}
              />
              <label htmlFor='password'>Password</label>
            </div>

            {error && (
              <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                {error}
              </p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading
                ? (isLogin ? 'Logging in...' : 'Creating account...')
                : (isLogin ? 'Log in to ResumeLens' : 'Create ResumeLens account')}
            </button>

            <p className='text-center text-sm text-text-primary/75'>
              {isLogin ? 'New to ResumeLens?' : 'Already have an account?'}
              <button
                type='button'
                onClick={handleModeToggle}
                className='mx-1 font-semibold text-button-background hover:text-button-background/80'
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
