import React from 'react'

const KeyFeatureCard = ({ index, title, description, icon: Icon }) => {
  return (
    <div className='surface-card interactive-card group rounded-[24px] p-6'>
      <div className='flex items-start justify-between gap-4'>
        <span className='rounded-full border border-button-background/18 bg-button-background/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-button-background'>
          0{index}
        </span>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl border border-[#0f766e]/15 bg-[#0f766e]/10 text-[#0f766e] shadow-sm transition duration-300 group-hover:bg-[#0f766e] group-hover:text-white'>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className='mt-7'>
        <h3 className='text-xl font-semibold leading-tight text-[#0f172a] transition duration-300 group-hover:text-button-background'>
          {title}
        </h3>
        <p className='mt-3 text-sm leading-6 text-light-gray-text'>
          {description}
        </p>
      </div>
    </div>
  )
}

export default KeyFeatureCard
