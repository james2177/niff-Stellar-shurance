jest.mock('@/lib/analytics', () => ({
  trackRouteSegmentError: jest.fn(),
}))

import { trackRouteSegmentError } from '@/lib/analytics'
import { logRouteSegmentError } from '@/lib/observability'

const mockTrack = trackRouteSegmentError as jest.Mock

describe('logRouteSegmentError', () => {
  const origEnv = process.env.NODE_ENV

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true, configurable: true })
    jest.clearAllMocks()
  })

  it('forwards only segment, error name, and digest to analytics in production', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true })
    const err = Object.assign(new Error('do not leak this message'), {
      digest: 'dig-9',
    })
    err.name = 'ChunkLoadError'

    logRouteSegmentError({ segment: 'claims', error: err })

    expect(mockTrack).toHaveBeenCalledWith({
      segment: 'claims',
      errorName: 'ChunkLoadError',
      digest: 'dig-9',
    })
    expect(JSON.stringify(mockTrack.mock.calls)).not.toMatch(/do not leak/)
  })

  it('does not call Plausible track in non-production', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true, configurable: true })
    logRouteSegmentError({
      segment: 'admin',
      error: Object.assign(new Error('x'), { digest: 'd' }),
    })
    expect(mockTrack).not.toHaveBeenCalled()
  })
})
