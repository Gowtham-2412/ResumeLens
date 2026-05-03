import React, { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  FileSearch,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  User2,
  X
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const userLabel = user?.username || user?.name || user?.email?.split('@')[0] || 'Member'

  const marketingLinks = useMemo(() => ([
    { label: 'Features', section: 'keyfeatures' },
    { label: 'Workflow', section: 'howitworks' },
    { label: 'About', section: 'footer-cta' }
  ]), [])

  const productLinks = useMemo(() => ([
    { label: 'Dashboard', to: user ? `/${user.id}` : '/', icon: LayoutDashboard },
    { label: 'Analyze', to: '/analyze', icon: FileSearch },
    { label: 'History', to: '/history', icon: History }
  ]), [user])

  const handleLogoClick = () => {
    closeMenu()
    navigate(isAuthenticated && user ? `/${user.id}` : '/')
  }

  const handleMarketingClick = (sectionId) => {
    closeMenu()

    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.location.href = `/#${sectionId}`
  }

  const handleLogout = () => {
    closeMenu()
    logout()
    navigate('/')
  }

  const handleNavigate = (path) => {
    closeMenu()
    navigate(path)
  }

  return (
    <nav className='sticky top-0 z-30 py-4 text-text-primary backdrop-blur'>
      <div className='surface-card flex items-center justify-between gap-4 border-black/10 px-4 py-3 sm:px-5'>
        <button
          type='button'
          onClick={handleLogoClick}
          className='flex items-center gap-3 px-1 py-1 text-left'
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f172a] text-white shadow-sm'>
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <div className='cursor-pointer'>
            <p
              className='text-lg font-bold tracking-tight sm:text-xl text-black/90'
            >
              ResumeLens
            </p>
            <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]'>ATS Workspace</p>
          </div>
        </button>

        <div className='hidden items-center gap-1 rounded-lg border border-black/10 bg-[#f1f5f9] p-1 md:flex'>
          {(isAuthenticated ? productLinks : marketingLinks).map((item) => {
            if ('section' in item) {
              return (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => handleMarketingClick(item.section)}
                  className='rounded-md px-4 py-2 text-sm font-semibold text-text-primary/70 hover:bg-white hover:text-text-primary hover:shadow-sm transition-colors'
                >
                  {item.label}
                </button>
              )
            }

            const Icon = item.icon

            return (
              <button
                key={item.label}
                type='button'
                onClick={() => handleNavigate(item.to)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  location.pathname === item.to
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-primary/70 hover:bg-white hover:text-text-primary hover:shadow-sm'
                }`}
              >
                <Icon size={16} strokeWidth={location.pathname === item.to ? 2.5 : 2} />
                {item.label}
              </button>
            )
          })}
        </div>

        {isAuthenticated && user ? (
          <div className='hidden items-center gap-3 md:flex'>
            <div className='rounded-lg border border-black/10 bg-[#f8fafc] px-3 py-2'>
              <div className='flex items-center gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-md bg-button-background/10 text-button-background'>
                  <User2 size={16} strokeWidth={2.5} />
                </div>
                <div className='text-left'>
                  <p className='text-sm font-semibold leading-none text-[#0f172a]'>{userLabel}</p>
                  <p className='mt-1 text-xs text-[#475569]'>Signed in</p>
                </div>
              </div>
            </div>
            <button
              type='button'
              onClick={handleLogout}
              className='btn-secondary px-4 py-3 text-sm'
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        ) : (
          <div className='hidden items-center gap-3 md:flex'>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-secondary px-4 py-3 text-sm'
            >
              Log in
            </button>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-primary px-4 py-3 text-sm'
            >
              Start free
              <ArrowUpRight size={16} />
            </button>
          </div>
        )}

        <button
          type='button'
          aria-expanded={isMenuOpen}
          aria-label='Toggle navigation menu'
          className='rounded-lg border border-black/10 bg-black/[0.02] p-2 md:hidden text-[#0f172a]'
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className='surface-card mt-3 p-4 md:hidden shadow-xl'>
          <div className='flex flex-col gap-2'>
            {(isAuthenticated ? productLinks : marketingLinks).map((item) => {
              if ('section' in item) {
                return (
                  <button
                    key={item.label}
                    type='button'
                    onClick={() => handleMarketingClick(item.section)}
                    className='flex items-center justify-between rounded-lg border border-black/5 bg-black/[0.02] px-4 py-3 text-left text-sm font-medium text-text-primary'
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={16} className='text-[#475569]' />
                  </button>
                )
              }

              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => handleNavigate(item.to)}
                  className='flex items-center justify-between rounded-lg border border-black/5 bg-black/[0.02] px-4 py-3 text-left text-sm font-medium text-text-primary'
                >
                  <span className='inline-flex items-center gap-2'>
                    <Icon size={16} className='text-[#0f766e]' />
                    {item.label}
                  </span>
                  <ArrowUpRight size={16} className='text-[#475569]' />
                </button>
              )
            })}
          </div>

          <div className='mt-4 border-t border-black/10 pt-4'>
            {isAuthenticated && user ? (
              <div className='space-y-3'>
                <div className='rounded-lg border border-black/5 bg-black/[0.02] px-4 py-3'>
                  <p className='text-sm font-semibold text-[#0f172a]'>{userLabel}</p>
                  <p className='mt-1 text-xs text-[#475569]'>Signed in to ResumeLens</p>
                </div>
                <button type='button' onClick={handleLogout} className='btn-secondary w-full justify-center'>
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            ) : (
              <div className='grid gap-3'>
                <button type='button' onClick={() => handleNavigate('/login')} className='btn-secondary w-full justify-center'>
                  Log in
                </button>
                <button type='button' onClick={() => handleNavigate('/login')} className='btn-primary w-full justify-center'>
                  Start free
                  <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
