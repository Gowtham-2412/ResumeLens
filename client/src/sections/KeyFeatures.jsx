import React from 'react'
import KeyFeatureCard from '../components/KeyFeatureCard'
import { Archive, FileSearch, Lightbulb, Radar, Target, WandSparkles } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const features = [
  {
    title: 'Job Description Comparison',
    description: 'Side-by-side comparison of your resume against the exact role you are targeting.',
    icon: FileSearch,
    highlight: true,
  },
  {
    title: 'Keyword Matching',
    description: 'Instantly see which critical technical terms already appear in your resume.',
    icon: Radar,
  },
  {
    title: 'Missing Skills Detection',
    description: 'Spot every skill and tool from the role that your resume does not mention yet.',
    icon: Target,
  },
  {
    title: 'ATS Score Analysis',
    description: 'Get a clear ATS compatibility score so each revision is measurable and trackable.',
    icon: WandSparkles,
    highlight: true,
  },
  {
    title: 'Actionable Suggestions',
    description: 'Turn missing keywords and weak phrasing into practical, ready-to-apply edits.',
    icon: Lightbulb,
  },
  {
    title: 'Analysis History',
    description: 'Reopen past analyses and track your progress across different resume versions.',
    icon: Archive,
  },
]

const KeyFeatures = () => {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id='keyfeatures' ref={ref} className='scroll-mt-20 py-10 sm:py-14'>
      <div className={`max-w-lg transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <span className='mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-signal'>Features</span>
        <h2 className='section-title'>Everything you need to beat the ATS</h2>
        <p className='section-copy mt-3'>
          Powerful tools built for one purpose: helping you tailor your resume for specific roles and land more interviews.
        </p>
      </div>

      <div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={`transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: `${200 + i * 100}ms` }}
          >
            <KeyFeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              highlight={feature.highlight}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default KeyFeatures
