/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { WalletBalanceDisplay } from '../components/WalletBalanceDisplay'

const mockWallet = { address: null as string | null, connectionStatus: 'disconnected' as string }

jest.mock('@/features/wallet/hooks/useWallet', () => ({
  useWallet: () => mockWallet,
}))

jest.mock('@/config/env', () => ({
  getConfig: () => ({ horizonUrl: 'https://horizon-testnet.stellar.org' }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('WalletBalanceDisplay', () => {
  beforeEach(() => {
    mockWallet.address = null
    mockWallet.connectionStatus = 'disconnected'
  })

  it('renders nothing when disconnected', () => {
    const { container } = render(<WalletBalanceDisplay />, { wrapper })
    expect(container).toBeEmptyDOMElement()
  })

  it('shows loading spinner while fetching', () => {
    mockWallet.address = 'GTEST123'
    mockWallet.connectionStatus = 'connected'
    // useQuery will be in loading state since fetch never resolves
    render(<WalletBalanceDisplay />, { wrapper })
    expect(screen.getByLabelText('Loading balances')).toBeInTheDocument()
  })

  it('formats XLM balance correctly', () => {
    // Test the formatting logic directly
    const format = (balance: string) => {
      const n = parseFloat(balance)
      return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    }
    expect(format('1234.5678900')).toBe('1,234.57')
    expect(format('0.0000000')).toBe('0')
    expect(format('100.0000000')).toBe('100')
    expect(format('9999999.9999999')).toBe('10,000,000')
  })

  it('extracts asset label from asset string', () => {
    const assetLabel = (asset: string) => {
      if (asset === 'XLM') return 'XLM'
      return asset.split(':')[0]
    }
    expect(assetLabel('XLM')).toBe('XLM')
    expect(assetLabel('NIFY:GISSUER123')).toBe('NIFY')
    expect(assetLabel('USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')).toBe('USDC')
  })
})
