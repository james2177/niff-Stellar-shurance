import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import { FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { XBULL_ID } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LOBSTR_ID } from '@creit.tech/stellar-wallets-kit/modules/lobstr'
import type { WalletId } from '../context/WalletContext'

export type WalletInstallState = Record<WalletId, boolean>

const MODULES: { id: WalletId; module: { isAvailable(): Promise<boolean> } }[] = [
  { id: FREIGHTER_ID as WalletId, module: new FreighterModule() },
  { id: XBULL_ID as WalletId, module: new xBullModule() },
  { id: LOBSTR_ID as WalletId, module: new LobstrModule() },
]

/** Probes each supported wallet module for browser availability. */
export async function detectInstalledWallets(): Promise<WalletInstallState> {
  const entries = await Promise.all(
    MODULES.map(async ({ id, module }) => {
      try {
        return [id, await module.isAvailable()] as const
      } catch {
        return [id, false] as const
      }
    }),
  )
  return Object.fromEntries(entries) as WalletInstallState
}
