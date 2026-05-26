/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import { PrintButton } from '../print-button'

describe('PrintButton', () => {
  it('renders with default label', () => {
    render(<PrintButton />)
    expect(screen.getByTestId('print-button')).toBeInTheDocument()
    expect(screen.getByText('Print / Save as PDF')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<PrintButton label="Export PDF" />)
    expect(screen.getByText('Export PDF')).toBeInTheDocument()
  })

  it('has no-print class so it hides in print view', () => {
    render(<PrintButton />)
    expect(screen.getByTestId('print-button')).toHaveClass('no-print')
  })

  it('calls window.print on click', () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {})
    render(<PrintButton />)
    fireEvent.click(screen.getByTestId('print-button'))
    expect(printSpy).toHaveBeenCalledTimes(1)
    printSpy.mockRestore()
  })
})
