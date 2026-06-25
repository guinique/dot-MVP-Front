import { describe, expect, it } from 'vitest'
import { ApiError } from '@/api/client'

describe('ApiError', () => {
  it('stores status code', () => {
    const err = new ApiError('Not found', 404)
    expect(err.message).toBe('Not found')
    expect(err.status).toBe(404)
  })
})
