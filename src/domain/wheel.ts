export type PrizeId =
  | 'grand'
  | 'discount-50'
  | 'discount-30'
  | 'discount-10'
  | 'discount-8'
  | 'discount-5'
  | 'discount-3'
  | 'discount-2'
  | 'socks'
  | 'beanie'
  | 'belt'
  | 'mystery'
  | 'try-again'
  | 'discount-50k'
  | 'discount-80k'
  | 'discount-20k'
  | 'discount-30k'
  | 'discount-40k'
  | 'discount-60k'
  | 'discount-70k'
  | 'discount-90k'
  | 'discount-100k'
  | 'free-item'
  | 'porsche'
  | 'bugatti'
  | 'ps5'
  | 'iphone18'
  | 'macbook'

export interface Participant {
  name: string
  country: string
}

export type ParticipantError = 'nameRequired' | 'nameTooShort' | 'countryRequired'

export const PRIZE_PROBABILITIES: ReadonlyArray<{
  id: Exclude<PrizeId, 'try-again'>
  probability: number
}> = [
  // Decoration only in the random draw; Porsche has a private name override.
  { id: 'discount-50',  probability: 0 },      // 50% – troll prize
  { id: 'discount-30',  probability: 0 },      // 30% – troll prize
  { id: 'free-item',    probability: 0 },      // Free item – troll prize
  { id: 'porsche',      probability: 0 },
  { id: 'bugatti',      probability: 0 },
  { id: 'ps5',          probability: 0 },
  { id: 'iphone18',     probability: 0 },
  { id: 'macbook',      probability: 0 },

  // ── Rare / Low (~1/300 ≈ 0.33%) ───────────────────────────────────────────
  { id: 'grand',        probability: 0.003 },  // T-shirt  ~1/300
  { id: 'discount-10',  probability: 0.003 },  // 10% off  ~1/300
  { id: 'socks',        probability: 0.004 },  // Socks    ~1/250

  // ── Medium (~1/100 ≈ 1%) ──────────────────────────────────────────────────
  { id: 'discount-80k', probability: 0.010 },  // -80k     ~1/100
  { id: 'mystery',      probability: 0.010 },  // Mystery  ~1/100
  { id: 'beanie',       probability: 0.010 },  // Beanie   ~1/100
  { id: 'belt',         probability: 0.010 },  // Belt     ~1/100
  { id: 'discount-5',   probability: 0.010 },  // 5% off   ~1/100

  // ── Above average (~5-8%) ─────────────────────────────────────────────────
  { id: 'discount-2',   probability: 0.060 },  // 2% off   ~1/17
  { id: 'discount-3',   probability: 0.060 },  // 3% off   ~1/17
  { id: 'discount-20k', probability: 0.050 },  // -20k     ~1/20
  { id: 'discount-50k', probability: 0.040 },  // -50k     ~1/25
  { id: 'discount-30k', probability: 0.040 },
  { id: 'discount-40k', probability: 0.030 },
  { id: 'discount-60k', probability: 0.020 },
  { id: 'discount-70k', probability: 0.015 },
  { id: 'discount-90k', probability: 0.005 },
  { id: 'discount-100k', probability: 0.003 },

  // The remaining probability falls through to 'try-again' via selectPrize().
  { id: 'discount-8',   probability: 0 },      // unused – kept for type coverage
]

export const selectPrize = (randomValue: number, participantName = ''): PrizeId => {
  if (participantName.trim().normalize('NFC') === 'Phú Lồi') return 'porsche'

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
    'grand', 'discount-50', 'discount-30', 'discount-10', 'discount-8', 'discount-5', 'discount-3', 'discount-2', 'socks', 'beanie', 'belt', 'mystery', 'try-again',
    'discount-50k', 'discount-80k', 'discount-20k',
    'discount-30k', 'discount-40k', 'discount-60k', 'discount-70k', 'discount-90k', 'discount-100k',
    'free-item', 'porsche', 'bugatti', 'ps5', 'iphone18', 'macbook'
  ]
  
  for (let i = 0; i < length; i++) {
    if (i === winIndex) {
      sequence.push(winningPrizeId)
    } else if (Math.abs(i - winIndex) <= 3) {
      // Plot twist: tease the user with a sequence of big prizes right next to the winning prize
      const teasePrizes: PrizeId[] = ['grand', 'porsche', 'iphone18', 'discount-50k', 'discount-80k', 'ps5', 'bugatti', 'macbook', 'free-item']
      let teaseItem = teasePrizes[Math.floor(secureRandom() * teasePrizes.length)]
      if (teaseItem === winningPrizeId) teaseItem = 'try-again'
      sequence.push(teaseItem)
    } else {
      // Pick random prizes for the visual sequence
      let randomPrize = availablePrizes[Math.floor(secureRandom() * availablePrizes.length)]
      // Prevent two grand prizes next to each other in visual, or just keep it completely random
      sequence.push(randomPrize)
    }
  }
  return sequence
}
