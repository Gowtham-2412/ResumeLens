import React, { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Lightbulb, Sparkles, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { useInView } from '../hooks/useInView'

const previewKeywords = [
  { label: 'React', matched: true },
  { label: 'REST API', matched: true },
  { label: 'TypeScript', matched: false },
  { label: 'Git', matched: true },
  { label: 'CSS', matched: true },
  { label: 'Testing', matched: false }
]

const HeroSection = () => {
  const navigate = useNavigate()
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [cardRef, cardInView] = useInView({ threshold: 0.2 })
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (!cardInView) return
    let frame
    const start = performance.now()
    const duration = 1400
    const target = 82

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setAnimatedScore(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [cardInView])

  return (
    <section className='relative overflow-hidden pb-12 pt-8 lg:pb-16 lg:pt-12'>
      <div className='hero-grid-bg' />

      <div className='hero-glow hero-glow-1' />
      <div className='hero-glow hero-glow-2' />

      <div
        ref={heroRef}
        className='relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20'
      >
        <div className={`max-w-xl transition-all duration-700 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal-subtle px-3.5 py-1.5'>
            <Sparkles size={14} className='text-signal' />
            <span className='text-xs font-semibold text-signal'>AI-Powered Resume Analysis</span>
          </div>

          <h1 className='font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]'>
            Land more interviews with an{' '}
            <span className='hero-gradient-text'>ATS-optimized</span>{' '}
            resume
          </h1>

          <p className='mt-5 text-lg leading-relaxed text-graphite'>
            Upload your resume and a job description. ResumeLens scores your ATS
            compatibility, flags missing keywords, and gives you a clear action plan to beat the bots.
          </p>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className='btn-primary group px-7 py-3.5 text-base shadow-lg shadow-signal/20'
            >
              Analyze your resume free
              <ArrowRight size={18} className='transition-transform group-hover:translate-x-0.5' />
            </button>
            <button
              type='button'
              onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })}
              className='btn-secondary px-6 py-3.5 text-base'
            >
              See how it works
            </button>
          </div>

          <div className='mt-8 flex items-center gap-6 text-sm text-graphite'>
            <span className='flex items-center gap-1.5'>
              <CheckCircle2 size={15} className='text-matched' /> Free to use
            </span>
            <span className='flex items-center gap-1.5'>
              <CheckCircle2 size={15} className='text-matched' /> No credit card
            </span>
            <span className='hidden items-center gap-1.5 sm:flex'>
              <CheckCircle2 size={15} className='text-matched' /> Instant results
            </span>
          </div>
        </div>

        <div
          ref={cardRef}
          className={`relative transition-all delay-200 duration-700 ${cardInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <div className='hero-card-glow' />

          <div className='surface-card relative overflow-hidden border-signal/10 p-6 shadow-xl shadow-signal/5 sm:p-8'>
            <div className='flex items-center justify-between border-b border-rule pb-4'>
              <p className='text-xs font-semibold uppercase tracking-widest text-graphite'>ATS Analysis Preview</p>
              <span className='inline-flex items-center gap-1.5 rounded-md bg-signal-light px-2.5 py-1 text-xs font-bold text-signal'>
                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-signal' />
                Live
              </span>
            </div>

            <div className='mt-6 flex flex-col items-center'>
              <ScoreRing score={animatedScore} size={140} strokeWidth={10} label='ATS Match Score' />
            </div>

            <div className='mt-6'>
              <div className='flex items-center gap-2 text-sm font-semibold text-ink'>
                <Target size={15} className='text-signal' />
                Keyword Match
              </div>
              <div className='mt-3 flex flex-wrap gap-2'>
                {previewKeywords.map((kw, i) => (
                  <span
                    key={kw.label}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-all duration-500 ${
                      cardInView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    } ${
                      kw.matched
                        ? 'bg-matched-light text-matched'
                        : 'bg-missing-light text-amber-700'
                    }`}
                    style={{ transitionDelay: `${600 + i * 80}ms` }}
                  >
                    {kw.matched ? <CheckCircle2 size={13} /> : null}
                    {kw.label}
                  </span>
                ))}
              </div>
            </div>

            <div className='mt-5 rounded-lg border border-signal/10 bg-signal-subtle p-3'>
              <div className='flex items-start gap-2.5'>
                <Lightbulb size={15} className='mt-0.5 shrink-0 text-signal' />
                <p className='text-sm leading-relaxed text-graphite'>
                  Add missing role terms and measurable achievements to boost your score by an estimated <strong className='text-ink'>12 points</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
