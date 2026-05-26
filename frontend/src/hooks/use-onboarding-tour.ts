'use client'

import { useCallback, useEffect, useRef } from 'react'

const TOUR_COMPLETED_KEY = 'niffyinsur-tour-completed'

export interface TourStep {
  element: string
  popover: { title: string; description: string; side?: 'top' | 'bottom' | 'left' | 'right' }
}

const TOUR_STEPS: TourStep[] = [
  {
    element: '[data-tour="connect-wallet"]',
    popover: {
      title: 'Connect your wallet',
      description: 'Start by connecting your Stellar wallet (Freighter or xBull) to access all features.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="view-policies"]',
    popover: {
      title: 'View your policies',
      description: 'See all your active insurance policies, coverage details, and expiry countdowns.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="file-claim"]',
    popover: {
      title: 'File a claim',
      description: 'Submit a claim with evidence when a covered event occurs. The DAO will vote on it.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="cast-vote"]',
    popover: {
      title: 'Cast a vote',
      description: 'Governance token holders vote to approve or reject claims transparently on-chain.',
      side: 'bottom',
    },
  },
]

export function isTourCompleted(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true'
}

export function resetTour(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOUR_COMPLETED_KEY)
  }
}

export function useOnboardingTour() {
  const driverRef = useRef<{ drive: () => void; destroy: () => void } | null>(null)

  const startTour = useCallback(async () => {
    // Dynamically import driver.js to avoid SSR issues
    const { driver } = await import('driver.js')
    await import('driver.js/dist/driver.css')

    const d = driver({
      animate: true,
      showProgress: true,
      steps: TOUR_STEPS,
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
        d.destroy()
      },
    })

    driverRef.current = d
    d.drive()
  }, [])

  // Auto-start on first visit
  useEffect(() => {
    if (!isTourCompleted()) {
      // Small delay so the page has rendered its tour targets
      const t = setTimeout(() => startTour(), 800)
      return () => clearTimeout(t)
    }
  }, [startTour])

  return { startTour }
}
