/// <reference types="vite/client" />
import type { SpinResult } from '../domain/spinStore'
import { getAllResults } from '../domain/spinStore'

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL

export const postSpinToSheet = async (payload: SpinResult): Promise<{ ok: boolean, reason?: string, id?: string }> => {
  if (!SHEET_API_URL) return { ok: false, reason: 'no_api_url' }
  
  try {
    const response = await fetch(SHEET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Google Scripts standard
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) return { ok: false, reason: 'http_error' }
    return await response.json()
  } catch (err) {
    console.error('Failed to post to sheets:', err)
    return { ok: false, reason: 'network_error' }
  }
}

export interface FeedItem {
  id: string
  name: string
  country: string
  prizeId: string
  createdAt: string
}

export const fetchFeedFromSheet = async (): Promise<FeedItem[]> => {
  if (!SHEET_API_URL) {
    return getAllResults()
      .filter((r) => r.prizeId !== 'try-again')
      .map((r, i) => ({
        id: r.id || `${r.code}-${i}`,
        name: r.name,
        country: r.country,
        prizeId: r.prizeId,
        createdAt: r.createdAt,
      }))
      .reverse()
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(SHEET_API_URL, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) return []
    const data = await response.json()
    if (data.ok && Array.isArray(data.results)) {
      return data.results
    }
    return []
  } catch (err) {
    console.error('Failed to fetch feed:', err)
    return []
  }
}
