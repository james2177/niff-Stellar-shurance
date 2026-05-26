/**
 * @jest-environment jsdom
 */
import { isTourCompleted, resetTour } from '../use-onboarding-tour'

const TOUR_KEY = 'niffyinsur-tour-completed'

describe('use-onboarding-tour', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('isTourCompleted returns false when key is absent', () => {
    expect(isTourCompleted()).toBe(false)
  })

  it('isTourCompleted returns true when key is set', () => {
    localStorage.setItem(TOUR_KEY, 'true')
    expect(isTourCompleted()).toBe(true)
  })

  it('resetTour removes the completed key', () => {
    localStorage.setItem(TOUR_KEY, 'true')
    resetTour()
    expect(localStorage.getItem(TOUR_KEY)).toBeNull()
    expect(isTourCompleted()).toBe(false)
  })
})
