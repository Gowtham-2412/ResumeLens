import React, { useState } from 'react'
import { ArrowLeft, LockKeyhole, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import google from '../assets/googlelogo.svg'
import { useAuth } from '../context/AuthContext'

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
    setFormData((prev) => ({ ...prev, [name]: value }))
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
        await login({ email: formData.email, password: formData.password })
      } else {
        await register(formData)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete the request.')
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-10'>
      <div className='w-full max-w-[420px]'>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='btn-ghost mb-6 text-sm text-graphite'
        >
          <ArrowLeft size={15} />
          Back to home
        </button>

        <div className='surface-card p-6 sm:p-8'>
          <div className='text-center'>
            <span className='font-display text-xl font-extrabold tracking-tight text-ink'>
              ResumeLens
            </span>
            <h1 className='mt-3 font-display text-2xl font-bold text-ink'>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className='mt-2 text-sm leading-relaxed text-graphite'>
              {isLogin
                ? 'Sign in to continue refining your resumes.'
                : 'Start optimizing your resume for any role.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <button
              type='button'
              onClick={handleGoogleLogin}
              disabled={loading}
              className='btn-secondary w-full justify-center py-3 text-sm'
            >
              <img src={google} alt='' className='w-5' />
              Continue with Google
            </button>

            <div className='flex items-center gap-3'>
              <div className='h-px flex-1 bg-rule' />
              <span className='text-xs font-medium uppercase tracking-widest text-graphite'>or</span>
              <div className='h-px flex-1 bg-rule' />
            </div>

            {!isLogin && (
              <div className='input-group has-icon'>
                <User size={15} className='pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-graphite/60' />
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
              <Mail size={15} className='pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-graphite/60' />
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
              <LockKeyhole size={15} className='pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-graphite/60' />
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
              <p className='rounded-lg border border-danger/20 bg-danger-light px-3 py-2.5 text-sm text-danger'>
                {error}
              </p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading
                ? (isLogin ? 'Signing in...' : 'Creating account...')
                : (isLogin ? 'Sign in' : 'Create account')}
            </button>

            <p className='text-center text-sm text-graphite'>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type='button'
                onClick={handleModeToggle}
                className='ml-1 font-semibold text-signal hover:text-signal-hover'
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
