import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer id='footer-cta' className='pb-12 pt-10 sm:pt-16'>
      <div className='surface-card overflow-hidden rounded-[34px] p-6 sm:p-8 lg:p-10'>
        <div className='grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center'>
          <div className='max-w-2xl'>
            <div className='eyebrow'>
              <Sparkles size={14} />
              Ready to apply better
            </div>
            <h2 className='section-title mt-5'>
              A cleaner interface, stronger hierarchy, and a more credible product experience.
            </h2>
            <p className='section-copy mt-4 max-w-xl text-sm sm:text-base'>
              ResumeLens is built for job seekers who want focused feedback, elegant presentation,
              and a workflow that feels calm instead of cluttered.
            </p>
          </div>

          <div className='space-y-4'>
            <button type='button' onClick={() => navigate('/login')} className='btn-primary w-full'>
              Create your account
              <ArrowRight size={18} />
            </button>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='stat-chip'>
                <p className='text-xl font-semibold'>Modern</p>
                <p className='mt-2 text-sm text-light-gray-text'>Polished layout and color system</p>
              </div>
              <div className='stat-chip'>
                <p className='text-xl font-semibold'>Focused</p>
                <p className='mt-2 text-sm text-light-gray-text'>Only the UI elements that matter</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 pt-5 text-sm text-light-gray-text sm:flex-row sm:items-center sm:justify-between'>
          <p>ResumeLens helps you tailor resumes with more clarity and confidence.</p>
          <p>ResumeLens (c) 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
