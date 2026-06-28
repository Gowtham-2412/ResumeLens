import React from 'react'

const StepCard = ({ icon: Icon, index, title, description, showConnector }) => {
  return (
    <div className='relative'>
      <div className='surface-card interactive-card group flex h-full flex-col p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-signal-light text-signal transition-all group-hover:bg-signal group-hover:text-white group-hover:shadow-lg group-hover:shadow-signal/20'>
            <Icon size={22} />
          </div>
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-canvas font-display text-sm font-bold text-graphite/50'>
            {index}
          </span>
        </div>

        <div className='mt-6'>
          <h3 className='font-display text-xl font-bold text-ink'>{title}</h3>
          <p className='mt-2 text-sm leading-relaxed text-graphite'>
            {description}
          </p>
        </div>
      </div>

      {showConnector && (
        <div className='pointer-events-none absolute -right-4 top-1/2 hidden h-px w-4 -translate-y-1/2 md:block'>
          <div className='h-full w-full bg-rule' />
          <div className='absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-signal' />
        </div>
      )}
    </div>
  )
}

export default StepCard
