import React from 'react'
import StepCard from '../components/StepCard'
import upload from '../assets/cloudUpload.svg'
import analyze from '../assets/analyze.svg'
import improve from '../assets/improve.svg'

const steps = [
  {
    title: 'Upload',
    description: 'Upload your resume as a PDF or DOCX file',
    icon: upload,
  },
  {
    title: 'Run ATS Analysis',
    description: 'Our engine parses, scores, and compares with target roles',
    icon: analyze,
  },
  {
    title: 'Improve',
    description: 'Follow actionable suggestions to boost your match score',
    icon: improve,
  },
]

const HowitWorks = () => {
  return (
    <section id='howitworks' className='scroll-mt-28 py-10 sm:py-14'>
      <div className='flex flex-col'>
        <div className='max-w-4xl'>
          <h2 className='section-title mt-5 font-semibold'>A clear, three-step experience that feels like a product.</h2>
        </div>
      </div>

      <div className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6'>
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            index={index + 1}
            title={step.title}
            description={step.description}
            icon={step.icon}
            showConnector={index < steps.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

export default HowitWorks
