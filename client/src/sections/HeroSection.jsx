import React from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import heroimage from '../assets/image.png'

const heroStats = [
  { label: 'Role comparisons', value: 'Fast' },
  { label: 'ATS feedback', value: 'Focused' },
  { label: 'Saved reviews', value: 'Tracked' }
]

const previewRows = [
  { label: 'React', value: 'Matched' },
  { label: 'REST API', value: 'Matched' },
  { label: 'TypeScript', value: 'Missing' }
]

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className='relative pb-16 pt-8 lg:pb-20 lg:pt-12'>
      <div className='grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12'>
        <div className='max-w-3xl'>
          <div className='eyebrow'>
            <Sparkles size={14} />
            Resume optimization workspace
          </div>

          <h1 className='mt-5 text-4xl font-extrabold leading-[1.05] text-[#0f172a] sm:text-5xl lg:text-6xl'>
            A sharper SaaS workflow for resume matching.
          </h1>

          <p className='section-copy mt-5 max-w-2xl text-base sm:text-lg'>
            Compare a resume against a real job description, see the ATS match, and keep every improvement cycle organized in one focused workspace.
          </p>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-primary px-5 py-3'
            >
              Run ATS Analysis
              <ArrowRight size={16} />
            </button>
            <button
              type='button'
              onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })}
              className='btn-secondary px-5 py-3'
            >
              View workflow
            </button>
          </div>

          <div className='mt-8 grid gap-3 sm:grid-cols-3'>
            {heroStats.map((item) => (
              <div key={item.label} className='stat-chip border-black/10'>
                <p className='text-2xl font-bold text-[#0f172a]'>{item.value}</p>
                <p className='mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]'>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='saas-panel-dark overflow-hidden rounded-lg p-4 sm:p-5'>
          <div className='flex items-center justify-between border-b border-white/10 pb-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-teal-200'>ResumeLens Live Review</p>
              <h2 className='mt-2 text-2xl font-bold'>Product-grade ATS dashboard</h2>
            </div>
            <span className='inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-xs font-bold text-teal-100'>
              <BadgeCheck size={14} />
              Active
            </span>
          </div>

          <div className='mt-5 grid gap-4 lg:grid-cols-[1fr_0.82fr]'>
            <div className='rounded-lg border border-white/10 bg-white/[0.06] p-3'>
              <img
                src={heroimage}
                alt='ATS analysis preview'
                className='h-full min-h-[250px] w-full rounded-md border border-white/10 object-cover object-top opacity-95'
              />
            </div>

            <div className='space-y-3'>
              <div className='rounded-lg border border-white/10 bg-white/[0.08] p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-300'>ATS Score</p>
                    <p className='mt-2 text-5xl font-extrabold'>82</p>
                  </div>
                  <div className='flex h-14 w-14 items-center justify-center rounded-lg bg-teal-300/12 text-teal-100'>
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className='progress-track mt-4 bg-white/10'>
                  <div className='progress-bar w-[82%]' />
                </div>
              </div>

              <div className='rounded-lg border border-white/10 bg-white/[0.08] p-4'>
                <div className='mb-3 flex items-center gap-2 text-sm font-bold'>
                  <Target size={16} className='text-teal-200' />
                  Keyword signal
                </div>
                <div className='space-y-2'>
                  {previewRows.map((row) => (
                    <div key={row.label} className='flex items-center justify-between rounded-md bg-white/[0.06] px-3 py-2 text-sm'>
                      <span className='font-semibold text-slate-100'>{row.label}</span>
                      <span className={row.value === 'Matched' ? 'text-teal-200' : 'text-amber-200'}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-lg border border-white/10 bg-white/[0.08] p-4'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-teal-100'>
                    <FileSearch size={16} />
                  </div>
                  <div>
                    <p className='text-sm font-bold'>Next best edit</p>
                    <p className='mt-1 text-xs leading-5 text-slate-300'>Add missing role terms and measurable achievements before resubmitting.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3'>
            {['PDF/DOCX parser', 'Keyword matching', 'History archive'].map((item) => (
              <div key={item} className='flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200'>
                <CheckCircle2 size={14} className='text-teal-200' />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
