import type { PrizeId } from './wheel'

export interface SpinResult {
  id?: string // for backend
  code: string
  createdAt: string
  deviceId: string
  mysteryDiscount: number | null
  name: string
  country: string
  prizeId: PrizeId
}

const RESULTS_KEY = 'insideout:spin-results'
const DEVICE_KEY = 'insideout:device-id'

const readResults = (): SpinResult[] => {
  try {
    const value = localStorage.getItem(RESULTS_KEY)
    return value ? (JSON.parse(value) as SpinResult[]) : []
  } catch {
    return []
  }
}

export const getAllResults = (): SpinResult[] => readResults()

export const getDeviceId = (): string => {
  const saved = localStorage.getItem(DEVICE_KEY)
  if (saved) return saved

  const id = crypto.randomUUID()
  localStorage.setItem(DEVICE_KEY, id)
  return id
}

export const canSpin = (deviceId: string): boolean =>
  !readResults().some((result) => result.deviceId === deviceId)

export const saveSpinResult = (result: SpinResult): void => {
  const results = readResults()
  localStorage.setItem(RESULTS_KEY, JSON.stringify([...results, result]))
}

export const getSavedResult = (deviceId: string): SpinResult | null =>
  readResults().find((result) => result.deviceId === deviceId) ?? null

export const getDailyGrandPrizeCount = (date: string): number =>
  readResults().filter(
    (result) => result.prizeId === 'grand' && result.createdAt.slice(0, 10) === date,
  ).length
