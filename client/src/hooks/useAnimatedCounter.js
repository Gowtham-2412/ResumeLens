import { useEffect, useState } from 'react'

export function useAnimatedCounter(target, inView, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let start = 0
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      if (current !== start) {
        start = current
        setCount(current)
      }

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, inView, duration])

  return count
}
