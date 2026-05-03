import React from 'react'
import KeyFeatureCard from '../components/KeyFeatureCard'
import { Archive, FileSearch, Lightbulb, Radar, Target, WandSparkles } from 'lucide-react'

const features = [
  {
    title: 'Job Description Comparison',
    description:
      'Compare your resume with the exact role description you are targeting.',
    icon: FileSearch,
  },
  {
    title: 'Keyword Matching',
    description:
      'See which important technical terms already appear in your resume.',
    icon: Radar,
  },
  {
    title: 'Missing Skills Detection',
    description:
      'Spot skills and tools from the role that your resume does not mention yet.',
    icon: Target,
  },
  {
    title: 'ATS Score Analysis',
    description:
      'Get a simple ATS-style score that makes each revision measurable.',
    icon: WandSparkles,
  },
  {
    title: 'Actionable Resume Suggestions',
    description:
      'Turn missing keywords and weak phrasing into practical next edits.',
    icon: Lightbulb,
  },
  {
    title: 'Resume Analysis History',
    description:
      'Reopen past analyses and track progress across different resume versions.',
    icon: Archive,
  },
]

const KeyFeatures = () => {
  return (
    <section id='keyfeatures' className='scroll-mt-28 py-10 sm:py-16'>
      <div className='flex flex-col'>
        <div className='max-w-3xl'>
          <h2 className='section-title mt-5 font-semibold'>Everything the app needs, without looking like a student demo.</h2>
        </div>
      </div>

      <div className='mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {features.map((feature, index) => (
          <KeyFeatureCard
            key={feature.title}
            index={index + 1}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  )
}

export default KeyFeatures
