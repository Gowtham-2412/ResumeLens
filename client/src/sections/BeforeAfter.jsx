import React from 'react'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import ScoreRing from '../components/ScoreRing'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'

const beforeKeywords = [
  { label: 'JavaScript', present: true },
  { label: 'HTML/CSS', present: true },
  { label: 'React', present: false },
  { label: 'TypeScript', present: false },
  { label: 'REST API', present: false },
  { label: 'Git', present: true },
  { label: 'Testing', present: false },
  { label: 'CI/CD', present: false },
]

const afterKeywords = [
  { label: 'JavaScript', present: true },
  { label: 'HTML/CSS', present: true },
  { label: 'React', present: true },
  { label: 'TypeScript', present: true },
  { label: 'REST API', present: true },
  { label: 'Git', present: true },
  { label: 'Testing', present: true },
  { label: 'CI/CD', present: true },
]

const BeforeAfter = () => {
  const [ref, inView] = useInView({ threshold: 0.15 })
  const beforeScore = useAnimatedCounter(47, inView, 1200)
  const afterScore = useAnimatedCounter(94, inView, 1600)

  return (
    <section ref={ref} className='py-10 sm:py-14'>
      <div className={`mx-auto max-w-lg text-center transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <span className='mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-signal'>The difference</span>
        <h2 className='section-title'>See the transformation</h2>
        <p className='section-copy mt-3'>
          Watch how targeted improvements turn a weak ATS score into a top-tier match.
        </p>
      </div>

      <div className='mt-8 grid gap-5 md:grid-cols-2'>
        <div
          className={`surface-card relative overflow-hidden p-6 transition-all duration-600 delay-200 sm:p-8 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className='absolute right-4 top-4 rounded-full bg-danger-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger'>
            Before
          </div>

          <div className='flex flex-col items-center'>
            <ScoreRing score={beforeScore} size={120} strokeWidth={9} label='ATS Score' />
          </div>

          <div className='mt-6 flex flex-wrap gap-2'>
            {beforeKeywords.map((kw) => (
              <span
                key={kw.label}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                  kw.present ? 'bg-matched-light text-matched' : 'bg-canvas text-graphite line-through'
                }`}
              >
                {kw.present ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                {kw.label}
              </span>
            ))}
          </div>

          <p className='mt-4 text-sm text-graphite'>3 of 8 keywords matched. Resume likely filtered out by ATS.</p>
        </div>

        <div
          className={`surface-card relative overflow-hidden border-matched/20 p-6 transition-all duration-600 delay-400 sm:p-8 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className='absolute right-4 top-4 rounded-full bg-matched-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-matched'>
            After
          </div>

          <div className='flex flex-col items-center'>
            <ScoreRing score={afterScore} size={120} strokeWidth={9} label='ATS Score' />
          </div>

          <div className='mt-6 flex flex-wrap gap-2'>
            {afterKeywords.map((kw) => (
              <span
                key={kw.label}
                className='inline-flex items-center gap-1 rounded-md bg-matched-light px-2 py-1 text-xs font-medium text-matched'
              >
                <CheckCircle2 size={11} />
                {kw.label}
              </span>
            ))}
          </div>

          <p className='mt-4 text-sm text-graphite'>8 of 8 keywords matched. Resume passes ATS filters with a strong score.</p>
        </div>
      </div>

      <div className={`mt-8 text-center transition-all duration-600 delay-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className='text-sm text-graphite'>
          Average users see a <strong className='font-semibold text-ink'>34% score improvement</strong> after applying ResumeLens suggestions.
        </p>
      </div>
    </section>
  )
}

export default BeforeAfter
