/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import { SessionTimeoutModal } from '../SessionTimeoutModal'

const mockWallet = { connectionStatus: 'connected' as string, disconnect: jest.fn() }
const mockRouter = { push: jest.fn() }

jest.mock('@/features/wallet', () => ({
  useWallet: () => mockWallet,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

jest.mock('@/lib/hooks/useAuth', () => ({
  setJwt: jest.fn(),
}))

// Override useIdleTimeout to control showWarning directly
const mockIdleTimeout = { showWarning: false, stayLoggedIn: jest.fn() }
jest.mock('@/hooks/use-idle-timeout', () => ({
  useIdleTimeout: () => mockIdleTimeout,
}))

describe('SessionTimeoutModal', () => {
  beforeEach(() => {
    mockWallet.connectionStatus = 'connected'
    mockWallet.disconnect.mockReset()
    mockRouter.push.mockReset()
    mockIdleTimeout.showWarning = false
    mockIdleTimeout.stayLoggedIn.mockReset()
  })

  it('renders nothing when wallet is disconnected', () => {
    mockWallet.connectionStatus = 'disconnected'
    const { container } = render(<SessionTimeoutModal />)
    expect(container).toBeEmptyDOMElement()
  })

  it('does not show modal when showWarning is false', () => {
    render(<SessionTimeoutModal />)
    expect(screen.queryByTestId('session-timeout-modal')).not.toBeInTheDocument()
  })

  it('shows modal when showWarning is true', () => {
    mockIdleTimeout.showWarning = true
    render(<SessionTimeoutModal />)
    expect(screen.getByTestId('session-timeout-modal')).toBeInTheDocument()
    expect(screen.getByText(/session expiring soon/i)).toBeInTheDocument()
    expect(screen.getByText(/2 minutes/i)).toBeInTheDocument()
  })

  it('calls stayLoggedIn when Stay logged in is clicked', () => {
    mockIdleTimeout.showWarning = true
    render(<SessionTimeoutModal />)
    fireEvent.click(screen.getByTestId('stay-logged-in-btn'))
    expect(mockIdleTimeout.stayLoggedIn).toHaveBeenCalledTimes(1)
  })

  it('disconnects and redirects when Log out now is clicked', async () => {
    mockIdleTimeout.showWarning = true
    mockWallet.disconnect.mockResolvedValue(undefined)
    render(<SessionTimeoutModal />)
    fireEvent.click(screen.getByTestId('logout-now-btn'))
    // Allow async disconnect to resolve
    await Promise.resolve()
    expect(mockWallet.disconnect).toHaveBeenCalled()
  })
})
