'use client'

import { useQuery } from '@tanstack/react-query'
import { getConfig } from '@/config/env'

export interface WalletBalance {
  asset: string // 'XLM' or 'TOKEN:ISSUER'
  balance: string // raw string from Horizon
  decimals: number
}

async function fetchBalances(address: string): Promise<WalletBalance[]> {
  const { horizonUrl } = getConfig()
  const res = await fetch(`${horizonUrl}/accounts/${encodeURIComponent(address)}`)
  if (!res.ok) throw new Error('Failed to fetch account')
  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.balances as any[]).map((b: any) => ({
    asset: b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`,
    balance: b.balance,
    decimals: 7,
  }))
}

export function useWalletBalances(address: string | null) {
  return useQuery({
    queryKey: ['wallet-balances', address],
    queryFn: () => fetchBalances(address!),
    enabled: !!address,
    refetchInterval: 30_000,
    staleTime: 25_000,
  })
}
