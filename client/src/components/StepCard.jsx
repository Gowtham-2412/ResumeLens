import React from 'react'

const StepCard = ({ icon, index, title, description, showConnector }) => {
  return (
    <div className='relative'>
      <div className='surface-card interactive-card group relative flex min-h-[17rem] flex-col overflow-hidden rounded-[24px] p-6 text-text-primary'>
        <div className='absolute right-0 top-0 h-28 w-28 rounded-full bg-button-background/10 blur-3xl transition duration-300 group-hover:bg-[#f0b56a]/12' />

        <div className='relative flex items-center justify-between gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#0f766e]/15 bg-[#0f766e]/10 shadow-inner'>
            <img src={icon} alt='' className='w-10' />
          </div>
          <span className='text-sm font-semibold tracking-[0.24em] text-light-gray-text'>0{index}</span>
        </div>

        <div className='relative mt-10'>
          <h3 className='text-2xl font-semibold'>{title}</h3>
          <p className='mt-3 max-w-xs text-base leading-7 text-light-gray-text'>
            {description}
          </p>
        </div>
      </div>

      {showConnector && (
        <div className='pointer-events-none absolute -right-8 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-linear-to-r from-button-background/55 to-transparent md:block' />
      )}
    </div>
  )
}

export default StepCard
