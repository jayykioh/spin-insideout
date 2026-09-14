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
    // 0% troll prizes → skip to grand at cumulative start ~0
    // grand: 0.003, discount-10: 0.006, socks: 0.010...
    // randomValue 0.001 → grand (first non-zero prize)
    expect(selectPrize(0.001)).toBe('grand')

    // randomValue 0.004 → discount-10 (cumulative: grand=0.003, then 0.003+0.003=0.006)
    expect(selectPrize(0.004)).toBe('discount-10')

    // out of bounds falls back to try-again (>0.27 total = remainder)
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
