import { describe, expect, it } from 'vitest'
import {
  createVoucherCode,
  isSpinPermitted,
  selectPrize,
  validateParticipant,
  generateRouletteSequence,
  PRIZE_PROBABILITIES,
} from './wheel'

describe('wheel domain', () => {
  it('selects prize based on probability', () => {
    // 0% troll prizes → skip to grand at cumulative start ~0
    // grand: 0.003, discount-10: 0.006, socks: 0.010...
    // randomValue 0.001 → grand (first non-zero prize)
    expect(selectPrize(0.001)).toBe('grand')

    // randomValue 0.004 → discount-10 (cumulative: grand=0.003, then 0.003+0.003=0.006)
    expect(selectPrize(0.004)).toBe('discount-10')

    // Values above the winning probability fall back to try-again.
    expect(selectPrize(0.99)).toBe('try-again')
  })

  it('always awards Porsche to the exact private name', () => {
    for (const value of [0, 0.004, 0.5, 0.99, 1]) {
      expect(selectPrize(value, 'Phú Lồi')).toBe('porsche')
      expect(selectPrize(value, ' Phú Lồi ')).toBe('porsche')
      expect(selectPrize(value, 'Phú Lồi'.normalize('NFD'))).toBe('porsche')
    }
  })

  it('never awards Porsche in the random draw or to other names', () => {
    for (const name of ['', 'Alex', 'Phu Loi', 'phú lồi', 'Phú Lồi Nguyễn']) {
      for (let i = 0; i <= 1000; i++) {
        expect(selectPrize(i / 1000, name)).not.toBe('porsche')
      }
    }
  })

  it('makes every cash discount reachable within a valid probability budget', () => {
    let cumulative = 0
    const selected = new Set<string>()
    for (const prize of PRIZE_PROBABILITIES) {
      if (prize.probability > 0) {
        selected.add(selectPrize(cumulative + prize.probability / 2, 'Alex'))
      }
      cumulative += prize.probability
    }
    expect(cumulative).toBeLessThan(1)
    for (const amount of [20, 30, 40, 50, 60, 70, 80, 90, 100]) {
      expect(selected.has(`discount-${amount}k`)).toBe(true)
    }
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
