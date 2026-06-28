import React from 'react'
import { FileText, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'

const stats = [
  { label: 'Resumes Analyzed', value: 12400, suffix: '+', icon: FileText },
  { label: 'Avg Score Increase', value: 34, suffix: '%', icon: TrendingUp },
  { label: 'Keywords Matched', value: 89000, suffix: '+', icon: Sparkles },
  { label: 'Active Users', value: 3200, suffix: '+', icon: Users },
]

const StatItem = ({ label, value, suffix, icon: Icon, inView, delay }) => {
  const count = useAnimatedCounter(value, inView, 1600)

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 1 : 1)}k` : count

  return (
    <div
      className={`flex items-center gap-4 transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal-light text-signal'>
        <Icon size={20} />
      </div>
      <div>
        <p className='font-display text-2xl font-extrabold tracking-tight text-ink'>
          {formatted}{suffix}
        </p>
        <p className='text-sm text-graphite'>{label}</p>
      </div>
    </div>
  )
}

const StatsBar = () => {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className='py-6 sm:py-8'>
      <div className='rounded-2xl border border-rule bg-canvas/60 px-6 py-6 sm:px-10 sm:py-8'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} inView={inView} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
