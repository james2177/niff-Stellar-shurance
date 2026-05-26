'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrintButtonProps {
  label?: string
  className?: string
}

/**
 * Triggers the browser's native print dialog.
 * Rendered with `no-print` class so it hides itself in the print view.
 */
export function PrintButton({ label = 'Print / Save as PDF', className }: PrintButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={['no-print gap-2', className].filter(Boolean).join(' ')}
      onClick={() => window.print()}
      aria-label={label}
      data-testid="print-button"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  )
}
