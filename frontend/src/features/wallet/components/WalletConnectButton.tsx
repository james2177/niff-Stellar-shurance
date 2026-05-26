'use client'

import { useState } from 'react'
import { Copy, Check, Wallet, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '../hooks/useWallet'
import { truncateAddress } from '../utils/truncateAddress'
import { WalletConnectModal } from './WalletConnectModal'

export function WalletConnectButton() {
  const { address, connectionStatus, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isConnected = connectionStatus === 'connected' && address
  const isConnecting = connectionStatus === 'connecting'

  async function handleCopy() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          title="Click to copy address"
          className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono hover:bg-accent transition-colors"
          aria-label={`Copy wallet address: ${truncateAddress(address)}`}
        >
          {truncateAddress(address)}
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
        </button>
        <Button variant="outline" size="sm" onClick={disconnect} aria-label="Disconnect wallet">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isConnecting}
        size="sm"
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>

      <WalletConnectModal open={open} onOpenChange={setOpen} />
    </>
  )
}
