/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useIdleTimeout } from '../use-idle-timeout'

describe('useIdleTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not show warning initially', () => {
    const onLogout = jest.fn()
    const { result } = renderHook(() =>
      useIdleTimeout({ timeoutMs: 10_000, warningMs: 2_000, onLogout }),
    )
    expect(result.current.showWarning).toBe(false)
  })

  it('shows warning after (timeout - warningMs)', () => {
    const onLogout = jest.fn()
    const { result } = renderHook(() =>
      useIdleTimeout({ timeoutMs: 10_000, warningMs: 2_000, onLogout }),
    )

    act(() => { jest.advanceTimersByTime(8_001) })
    expect(result.current.showWarning).toBe(true)
    expect(onLogout).not.toHaveBeenCalled()
  })

  it('calls onLogout after full timeout', () => {
    const onLogout = jest.fn()
    renderHook(() =>
      useIdleTimeout({ timeoutMs: 10_000, warningMs: 2_000, onLogout }),
    )

    act(() => { jest.advanceTimersByTime(10_001) })
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('resets timers when stayLoggedIn is called', () => {
    const onLogout = jest.fn()
    const { result } = renderHook(() =>
      useIdleTimeout({ timeoutMs: 10_000, warningMs: 2_000, onLogout }),
    )

    act(() => { jest.advanceTimersByTime(8_001) })
    expect(result.current.showWarning).toBe(true)

    act(() => { result.current.stayLoggedIn() })
    expect(result.current.showWarning).toBe(false)

    // Should not logout after original timeout since timers were reset
    act(() => { jest.advanceTimersByTime(2_001) })
    expect(onLogout).not.toHaveBeenCalled()
  })

  it('resets timers on user activity', () => {
    const onLogout = jest.fn()
    renderHook(() =>
      useIdleTimeout({ timeoutMs: 10_000, warningMs: 2_000, onLogout }),
    )

    act(() => { jest.advanceTimersByTime(7_000) })
    // Simulate user activity
    act(() => { window.dispatchEvent(new MouseEvent('mousemove')) })
    // Advance past original timeout — should not logout since timers reset
    act(() => { jest.advanceTimersByTime(4_000) })
    expect(onLogout).not.toHaveBeenCalled()
  })
})
