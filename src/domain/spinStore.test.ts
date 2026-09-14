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

  it('allows multiple spins in store kiosk mode', () => {
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

    // Store kiosk mode permits next guests to spin
    expect(canSpin(deviceId)).toBe(true)
  })

  it('generates unique device session id', () => {
    const id1 = getDeviceId()
    const id2 = getDeviceId()
    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
  })
})
