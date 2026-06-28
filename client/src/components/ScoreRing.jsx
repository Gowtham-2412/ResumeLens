import React from 'react'

const ScoreRing = ({ score = 0, size = 120, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filled = Math.min(100, Math.max(0, score))
  const offset = circumference - (filled / 100) * circumference

  return (
    <div className='flex flex-col items-center gap-2'>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className='block'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke='#e4e4e7'
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke='#2563eb'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className='transition-[stroke-dashoffset] duration-700 ease-out'
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor='middle'
          dominantBaseline='central'
          className='fill-ink font-display font-bold'
          style={{ fontSize: size * 0.28 }}
        >
          {score}
        </text>
      </svg>
      {label && (
        <span className='text-xs font-medium text-graphite'>{label}</span>
      )}
    </div>
  )
}

export default ScoreRing
