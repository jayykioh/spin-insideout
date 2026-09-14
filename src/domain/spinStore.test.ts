import { afterEach, describe, expect, it } from 'vitest'
import {
  canSpin,
  getDailyGrandPrizeCount,
  getDeviceId,
  saveSpinResult,
} from './spinStore'

describe('spinStore', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('manages spin eligibility based on deviceId', () => {
    const deviceId = getDeviceId()
    expect(canSpin(deviceId)).toBe(true)

    saveSpinResult({
      code: 'ABCDEF',
      createdAt: '2026-09-28T08:00:00.000Z',
      deviceId,
      mysteryDiscount: null,
      name: 'Alex',
      country: 'VN',
      prizeId: 'grand',
    })

    expect(canSpin(deviceId)).toBe(false)
  })

  it('persists device id', () => {
    const id1 = getDeviceId()
    const id2 = getDeviceId()
    expect(id1).toBe(id2)
  })
})
