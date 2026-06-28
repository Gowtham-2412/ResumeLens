import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const faqs = [
  {
    question: 'What is an ATS and why does it matter?',
    answer: 'An Applicant Tracking System (ATS) is software that companies use to filter resumes before a human ever sees them. Over 90% of large companies use one. If your resume isn\'t optimized for ATS keywords, it may be automatically rejected — even if you\'re qualified for the role.',
  },
  {
    question: 'How does ResumeLens analyze my resume?',
    answer: 'You upload your resume and paste the target job description. Our engine extracts keywords from the job listing, compares them against your resume content, calculates an ATS compatibility score, and generates specific suggestions for improvement.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'ResumeLens supports PDF and DOCX files up to 2 MB. These are the most common resume formats accepted by ATS systems.',
  },
  {
    question: 'Is ResumeLens free to use?',
    answer: 'Yes! You can create an account and run analyses completely free. We believe everyone deserves access to tools that help them land interviews.',
  },
  {
    question: 'How accurate is the ATS score?',
    answer: 'Our scoring algorithm is built to mirror how popular ATS systems evaluate resumes. It checks keyword presence, density, and placement. While no tool can guarantee a 100% match with every ATS on the market, our users see significant improvements in callback rates after optimizing their resumes with our suggestions.',
  },
  {
    question: 'Can I analyze my resume for multiple job roles?',
    answer: 'Absolutely. You can run as many analyses as you want with different job descriptions. Each analysis is saved to your history so you can track how your resume performs across different roles and versions.',
  },
]

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className='border-b border-rule'>
      <button
        type='button'
        onClick={onToggle}
        className='flex w-full items-center justify-between gap-4 py-5 text-left'
      >
        <span className='font-display text-[0.95rem] font-semibold text-ink'>{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-graphite transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className='grid transition-[grid-template-rows] duration-300'
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className='overflow-hidden'>
          <p className='pb-5 text-sm leading-relaxed text-graphite'>{answer}</p>
        </div>
      </div>
    </div>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className='py-10 sm:py-14'>
      <div className={`mx-auto max-w-lg text-center transition-all duration-600 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <span className='mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-signal'>FAQ</span>
        <h2 className='section-title'>Frequently asked questions</h2>
        <p className='section-copy mt-3'>
          Everything you need to know about ResumeLens and ATS optimization.
        </p>
      </div>

      <div
        className={`mx-auto mt-8 max-w-2xl transition-all duration-600 delay-200 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div className='surface-card divide-y-0 overflow-hidden px-6 sm:px-8'>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
