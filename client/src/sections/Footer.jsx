import React from 'react'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

const Footer = () => {
  const navigate = useNavigate()
  const [ctaRef, ctaInView] = useInView({ threshold: 0.2 })
  const [footRef, footInView] = useInView({ threshold: 0.3 })

  return (
    <footer id='footer-cta' className='pb-10 pt-8 sm:pt-12'>
      <div
        ref={ctaRef}
        className={`cta-gradient relative overflow-hidden rounded-2xl px-6 py-10 text-center sm:px-10 sm:py-14 transition-all duration-700 ${ctaInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div className='cta-grid-bg' />

        <div className='relative'>
          <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'>
            <Zap size={24} className='text-white' />
          </div>

          <h2 className='font-display text-2xl font-bold text-white sm:text-4xl'>
            Ready to land more interviews?
          </h2>
          <p className='mx-auto mt-4 max-w-md text-base text-white/80'>
            Join thousands of job seekers who use ResumeLens to optimize their resumes and beat the ATS.
          </p>

          <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-display text-base font-semibold text-signal shadow-lg transition-all hover:bg-white/90 hover:shadow-xl'
            >
              Get started free
              <ArrowRight size={18} />
            </button>
          </div>

          <div className='mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70'>
            <span className='flex items-center gap-1.5'>
              <CheckCircle2 size={14} /> No credit card required
            </span>
            <span className='flex items-center gap-1.5'>
              <CheckCircle2 size={14} /> Unlimited analyses
            </span>
            <span className='flex items-center gap-1.5'>
              <CheckCircle2 size={14} /> Results in seconds
            </span>
          </div>
        </div>
      </div>

      <div
        ref={footRef}
        className={`mt-8 flex flex-col items-center gap-4 text-sm text-graphite sm:flex-row sm:justify-between transition-all duration-600 ${footInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div className='flex items-center gap-2'>
          <span className='font-display text-base font-extrabold text-ink'>ResumeLens</span>
          <span className='rounded bg-signal-light px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-signal'>ATS</span>
        </div>
        <p>Built to help you get past the bots and into the interview room.</p>
        <p>&copy; 2026 ResumeLens. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
