'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [opacity, setOpacity] = useState(1)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    // Brief fade-in on route change
    setOpacity(0)
    const t = setTimeout(() => setOpacity(1), 40)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      style={{
        opacity,
        transition: opacity === 1 ? 'opacity 0.25s ease' : 'none',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      {children}
    </div>
  )
}
