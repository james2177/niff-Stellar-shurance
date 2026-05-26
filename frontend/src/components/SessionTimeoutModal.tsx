'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWallet } from '@/features/wallet'
import { setJwt } from '@/lib/hooks/useAuth'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'

/** Idle timeout in ms — 30 minutes. Configurable via env for testing. */
const TIMEOUT_MS =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS
    ? parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS, 10)
    : 30 * 60 * 1000

export function SessionTimeoutModal() {
  const { disconnect, connectionStatus } = useWallet()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    setJwt(null)
    await disconnect()
    router.push('/') // redirect to home / login
  }, [disconnect, router])

  const { showWarning, stayLoggedIn } = useIdleTimeout({
    timeoutMs: TIMEOUT_MS,
    onLogout: handleLogout,
  })

  // Only active when wallet is connected
  if (connectionStatus !== 'connected') return null

  return (
    <Dialog open={showWarning} onOpenChange={(open) => { if (!open) stayLoggedIn() }}>
      <DialogContent
        className="max-w-sm"
        aria-labelledby="session-timeout-title"
        aria-describedby="session-timeout-desc"
        data-testid="session-timeout-modal"
      >
        <DialogHeader>
          <DialogTitle id="session-timeout-title">Session expiring soon</DialogTitle>
          <DialogDescription id="session-timeout-desc">
            You&apos;ve been inactive for a while. You will be automatically logged out in{' '}
            <strong>2 minutes</strong> unless you continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="outline" onClick={handleLogout} data-testid="logout-now-btn">
            Log out now
          </Button>
          <Button onClick={stayLoggedIn} data-testid="stay-logged-in-btn">
            Stay logged in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
