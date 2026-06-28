import React, { useState } from 'react'
import {
  ArrowRight,
  FileSearch,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const closeMenu = () => setIsMenuOpen(false)

  const userLabel = user?.username || user?.name || user?.email?.split('@')[0] || 'Member'

  const marketingLinks = [
    { label: 'Features', section: 'keyfeatures' },
    { label: 'Workflow', section: 'howitworks' },
    { label: 'About', section: 'footer-cta' }
  ]

  const productLinks = [
    { label: 'Dashboard', to: user ? `/${user.id}` : '/', icon: LayoutDashboard },
    { label: 'Analyze', to: '/analyze', icon: FileSearch },
    { label: 'History', to: '/history', icon: History }
  ]

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

  const links = isAuthenticated ? productLinks : marketingLinks

  return (
    <nav className='sticky top-0 z-30 py-3'>
      <div className='flex items-center justify-between rounded-xl border border-rule bg-paper/90 px-4 py-2.5 shadow-sm backdrop-blur-md sm:px-5'>
        <button
          type='button'
          onClick={handleLogoClick}
          className='flex items-center gap-2 py-1'
        >
          <span className='font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl'>
            ResumeLens
          </span>
          <span className='rounded bg-signal-light px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-signal'>
            ATS
          </span>
        </button>

        <div className='hidden items-center gap-1 md:flex'>
          {links.map((item) => {
            if ('section' in item) {
              return (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => handleMarketingClick(item.section)}
                  className='btn-ghost text-sm'
                >
                  {item.label}
                </button>
              )
            }

            const Icon = item.icon
            const isActive = location.pathname === item.to

            return (
              <button
                key={item.label}
                type='button'
                onClick={() => handleNavigate(item.to)}
                className={`btn-ghost inline-flex items-center gap-1.5 text-sm ${
                  isActive ? 'bg-canvas text-ink font-semibold' : ''
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            )
          })}
        </div>

        {isAuthenticated && user ? (
          <div className='hidden items-center gap-3 md:flex'>
            <span className='text-sm font-medium text-graphite'>{userLabel}</span>
            <button type='button' onClick={handleLogout} className='btn-ghost text-sm text-graphite'>
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        ) : (
          <div className='hidden items-center gap-2 md:flex'>
            <button type='button' onClick={() => navigate('/login')} className='btn-ghost text-sm'>
              Log in
            </button>
            <button type='button' onClick={() => navigate('/login')} className='btn-primary text-sm'>
              Get started
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        <button
          type='button'
          aria-expanded={isMenuOpen}
          aria-label='Toggle navigation menu'
          className='rounded-lg border border-rule p-2 text-ink md:hidden'
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className='mt-2 rounded-xl border border-rule bg-paper p-3 shadow-lg md:hidden'>
          <div className='flex flex-col gap-1'>
            {links.map((item) => {
              if ('section' in item) {
                return (
                  <button
                    key={item.label}
                    type='button'
                    onClick={() => handleMarketingClick(item.section)}
                    className='rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-canvas'
                  >
                    {item.label}
                  </button>
                )
              }

              const Icon = item.icon
              const isActive = location.pathname === item.to

              return (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => handleNavigate(item.to)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                    isActive ? 'bg-canvas text-ink' : 'text-graphite hover:bg-canvas hover:text-ink'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className='mt-2 border-t border-rule pt-2'>
            {isAuthenticated && user ? (
              <div className='space-y-1'>
                <div className='px-3 py-2'>
                  <p className='text-sm font-medium text-ink'>{userLabel}</p>
                  <p className='text-xs text-graphite'>Signed in</p>
                </div>
                <button type='button' onClick={handleLogout} className='btn-ghost w-full justify-start text-sm'>
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            ) : (
              <div className='grid gap-2 pt-1'>
                <button type='button' onClick={() => handleNavigate('/login')} className='btn-secondary w-full justify-center text-sm'>
                  Log in
                </button>
                <button type='button' onClick={() => handleNavigate('/login')} className='btn-primary w-full justify-center text-sm'>
                  Get started
                  <ArrowRight size={15} />
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
