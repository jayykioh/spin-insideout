import { describe, expect, it } from 'vitest'
import {
  createVoucherCode,
  isSpinPermitted,
  selectPrize,
  validateParticipant,
  generateRouletteSequence
} from './wheel'

describe('wheel domain', () => {
  it('selects prize based on probability', () => {
    // 1 / 150 = 0.00666...
    expect(selectPrize(0.005)).toBe('grand')
    
    // grand (0.00666) + discount-50 (0.015) = 0.02166...
    expect(selectPrize(0.01)).toBe('discount-50')
    
    // out of bounds falls back to try-again
    expect(selectPrize(0.99)).toBe('try-again')
  })

  it('validates participant', () => {
    expect(validateParticipant({ name: 'Alex', country: 'VN' })).toEqual({})
    
    expect(validateParticipant({ name: '', country: 'VN' })).toEqual({ name: 'nameRequired' })
    expect(validateParticipant({ name: 'A', country: 'VN' })).toEqual({ name: 'nameTooShort' })
    
    expect(validateParticipant({ name: 'Alex', country: '' })).toEqual({ country: 'countryRequired' })
  })

  it('evaluates spin permission', () => {
    expect(
      isSpinPermitted({ registered: true, spinning: false, closed: false, eligible: true, hasSpun: false }),
    ).toBe(true)

    expect(
      isSpinPermitted({ registered: true, spinning: false, closed: false, eligible: false, hasSpun: false }),
    ).toBe(false)
    
    expect(
      isSpinPermitted({ registered: true, spinning: false, closed: false, eligible: true, hasSpun: true }),
    ).toBe(false)
  })

  it('creates unique 6-character voucher code', () => {
    const code = createVoucherCode()
    expect(code).toHaveLength(6)
    expect(code).toMatch(/^[A-Z2-9]{6}$/)
  })

  it('generates roulette sequence correctly', () => {
    const seq = generateRouletteSequence('grand', 100, 85)
    expect(seq.length).toBe(100)
    expect(seq[85]).toBe('grand')
  })
})
