'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseIdleTimeoutOptions {
  /** Total idle time before auto-logout (ms). Default: 30 minutes. */
  timeoutMs?: number
  /** How long before timeout to show the warning modal (ms). Default: 2 minutes. */
  warningMs?: number
  onLogout: () => void
}

const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const

export function useIdleTimeout({
  timeoutMs = 30 * 60 * 1000,
  warningMs = 2 * 60 * 1000,
  onLogout,
}: UseIdleTimeoutOptions) {
  const [showWarning, setShowWarning] = useState(false)
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (warningTimer.current) clearTimeout(warningTimer.current)
  }, [])

  const resetTimers = useCallback(() => {
    clearTimers()
    setShowWarning(false)

    warningTimer.current = setTimeout(() => {
      setShowWarning(true)
    }, timeoutMs - warningMs)

    logoutTimer.current = setTimeout(() => {
      setShowWarning(false)
      onLogout()
    }, timeoutMs)
  }, [clearTimers, onLogout, timeoutMs, warningMs])

  // Start timers and attach activity listeners
  useEffect(() => {
    resetTimers()

    const handleActivity = () => resetTimers()
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))

    return () => {
      clearTimers()
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, handleActivity))
    }
  }, [resetTimers, clearTimers])

  const stayLoggedIn = useCallback(() => {
    resetTimers()
  }, [resetTimers])

  return { showWarning, stayLoggedIn }
}
