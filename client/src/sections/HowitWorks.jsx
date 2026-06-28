import React from 'react'
import StepCard from '../components/StepCard'
import { ArrowRight, FileUp, ScanSearch, TrendingUp } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    title: 'Upload',
    description: 'Drop your resume as a PDF or DOCX. We extract every detail automatically.',
    icon: FileUp,
  },
  {
    title: 'Analyze',
    description: 'Our engine parses, scores, and compares your resume against the target role in seconds.',
    icon: ScanSearch,
  },
  {
    title: 'Improve',
    description: 'Follow clear, actionable suggestions to close gaps and boost your ATS score.',
    icon: TrendingUp,
  },
]

const HowitWorks = () => {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const navigate = useNavigate()

  return (
    <section id='howitworks' ref={ref} className='scroll-mt-20 py-10 sm:py-14'>
      <div className={`max-w-lg transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <span className='mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-signal'>How it works</span>
        <h2 className='section-title'>Three steps to a stronger resume</h2>
        <p className='section-copy mt-3'>
          A simple workflow that turns any resume into a targeted, ATS-ready document.
        </p>
      </div>

      <div className='mt-8 grid gap-4 md:grid-cols-3 md:gap-5'>
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: `${200 + index * 150}ms` }}
          >
            <StepCard
              index={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
              showConnector={index < steps.length - 1}
            />
          </div>
        ))}
      </div>

      <div className={`mt-8 flex justify-center transition-all duration-600 delay-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button
          type='button'
          onClick={() => navigate('/login')}
          className='btn-primary group px-6 py-3 text-base'
        >
          Try it now — it's free
          <ArrowRight size={18} className='transition-transform group-hover:translate-x-0.5' />
        </button>
      </div>
    </section>
  )
}

export default HowitWorks
