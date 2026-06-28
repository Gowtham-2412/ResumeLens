import React from 'react'

const KeyFeatureCard = ({ title, description, icon: Icon, highlight }) => {
  return (
    <div className={`surface-card interactive-card group p-5 ${highlight ? 'border-signal/15 bg-signal-subtle/30' : ''}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        highlight
          ? 'bg-signal text-white group-hover:bg-signal-hover'
          : 'bg-signal-light text-signal group-hover:bg-signal group-hover:text-white'
      }`}>
        {Icon && <Icon size={20} />}
      </div>

      <h3 className='mt-4 font-display text-base font-bold text-ink'>
        {title}
      </h3>
      <p className='mt-2 text-sm leading-relaxed text-graphite'>
        {description}
      </p>
    </div>
  )
}

export default KeyFeatureCard
