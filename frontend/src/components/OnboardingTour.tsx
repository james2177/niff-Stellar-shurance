'use client'

import { useOnboardingTour } from '@/hooks/use-onboarding-tour'

/**
 * Drop this component anywhere in the tree to enable the auto-start tour.
 * It renders nothing visible — the tour overlay is injected by driver.js.
 */
export function OnboardingTour() {
  useOnboardingTour()
  return null
}
