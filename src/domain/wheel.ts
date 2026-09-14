export type PrizeId =
  | 'grand'
  | 'discount-50'
  | 'discount-30'
  | 'discount-10'
  | 'socks'
  | 'beanie'
  | 'belt'
  | 'mystery'
  | 'try-again'

export interface Participant {
  name: string
  country: string
}

export type ParticipantError = 'nameRequired' | 'nameTooShort' | 'countryRequired'

export const PRIZE_PROBABILITIES: ReadonlyArray<{
  id: Exclude<PrizeId, 'try-again'>
  probability: number
}> = [
  { id: 'grand', probability: 1 / 150 },
  { id: 'discount-50', probability: 0.015 },
  { id: 'discount-30', probability: 0.04 },
  { id: 'discount-10', probability: 0.09 },
  { id: 'socks', probability: 0.06 },
  { id: 'beanie', probability: 0.02 },
  { id: 'belt', probability: 0.01 },
  { id: 'mystery', probability: 0.07 },
]

export const selectPrize = (randomValue: number): PrizeId => {
  const boundedValue = Math.min(Math.max(randomValue, 0), 1 - Number.EPSILON)
  let cumulative = 0

  for (const prize of PRIZE_PROBABILITIES) {
    cumulative += prize.probability
    if (boundedValue < cumulative) return prize.id
  }

  return 'try-again'
}

export const validateParticipant = (
  participant: Participant,
): Partial<Record<keyof Participant, ParticipantError>> => {
  const errors: Partial<Record<keyof Participant, ParticipantError>> = {}
  const name = participant.name.trim()

  if (!name) errors.name = 'nameRequired'
  else if (name.length < 2) errors.name = 'nameTooShort'

  if (!participant.country) errors.country = 'countryRequired'
  return errors
}

const VOUCHER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const secureRandom = (): number => {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 2 ** 32
}

export const createVoucherCode = (random: () => number = secureRandom): string =>
  Array.from({ length: 6 }, () => {
    const index = Math.floor(random() * VOUCHER_ALPHABET.length)
    return VOUCHER_ALPHABET[Math.min(index, VOUCHER_ALPHABET.length - 1)]
  }).join('')

export const isSpinPermitted = ({
  registered,
  spinning,
  closed,
  eligible,
  hasSpun,
}: {
  registered: boolean
  spinning: boolean
  closed: boolean
  eligible: boolean
  hasSpun: boolean
}): boolean => registered && !spinning && !closed && eligible && !hasSpun

// Helper to generate the sequence of prizes for the roulette animation
export const generateRouletteSequence = (winningPrizeId: PrizeId, length = 100, winIndex = 85): PrizeId[] => {
  const sequence: PrizeId[] = []
  const availablePrizes: PrizeId[] = [
    'grand', 'discount-50', 'discount-30', 'discount-10', 'socks', 'beanie', 'belt', 'mystery', 'try-again'
  ]
  
  for (let i = 0; i < length; i++) {
    if (i === winIndex) {
      sequence.push(winningPrizeId)
    } else {
      // Pick random prizes for the visual sequence
      let randomPrize = availablePrizes[Math.floor(secureRandom() * availablePrizes.length)]
      // Prevent two grand prizes next to each other in visual, or just keep it completely random
      sequence.push(randomPrize)
    }
  }
  return sequence
}
