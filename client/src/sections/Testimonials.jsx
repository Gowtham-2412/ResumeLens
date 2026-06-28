import React from 'react'
import { Star } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    quote: 'I was applying to dozens of roles with no callbacks. After running my resume through ResumeLens and fixing the gaps, I got 3 interviews in one week.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Marcus Chen',
    role: 'Product Manager',
    quote: 'The keyword matching showed me exactly what I was missing. My ATS score went from 52 to 91. Finally understanding why my applications were getting lost.',
    rating: 5,
    initials: 'MC',
  },
  {
    name: 'Sarah Williams',
    role: 'Data Analyst',
    quote: 'Simple, fast, and actually useful. I paste the job description, upload my resume, and get a clear list of what to fix. No fluff, just results.',
    rating: 5,
    initials: 'SW',
  },
]

const Testimonials = () => {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className='py-10 sm:py-14'>
      <div className={`mx-auto max-w-lg text-center transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <span className='mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-signal'>Testimonials</span>
        <h2 className='section-title'>Loved by job seekers</h2>
        <p className='section-copy mt-3'>
          Thousands of professionals use ResumeLens to land more interviews.
        </p>
      </div>

      <div className='mt-8 grid gap-5 md:grid-cols-3'>
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className={`surface-card group flex flex-col p-6 transition-all duration-600 hover:border-signal/20 hover:shadow-lg hover:shadow-signal/5 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: `${200 + i * 150}ms` }}
          >
            <div className='flex gap-0.5'>
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className='fill-amber-400 text-amber-400' />
              ))}
            </div>

            <blockquote className='mt-4 flex-1 text-sm leading-relaxed text-graphite'>
              "{t.quote}"
            </blockquote>

            <div className='mt-5 flex items-center gap-3 border-t border-rule pt-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-signal-light font-display text-sm font-bold text-signal'>
                {t.initials}
              </div>
              <div>
                <p className='text-sm font-semibold text-ink'>{t.name}</p>
                <p className='text-xs text-graphite'>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
