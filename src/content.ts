import type { PrizeId } from './domain/wheel'

export const APP_CONFIG = {
  openingDate: '2026-09-28T08:00:00+07:00',
  spinsClosed: false,
  dailyGrandPrizeLimit: 5,
  spinDuration: 7, // seconds for CSGO roulette spin
} as const

export const prizeVisuals: Record<PrizeId, {
  color: string
  accent: string
  image?: string
  label: string
}> = {
  'grand': { color: '#F5C54A', accent: '#5A3513', image: '/src/images/tshirt.png', label: 'T-SHIRT' },
  'discount-50': { color: '#F16B4E', accent: '#FFF8EC', label: '50% OFF' },
  'discount-30': { color: '#F39A4A', accent: '#48250A', label: '30% OFF' },
  'discount-10': { color: '#A8DCC5', accent: '#173D32', label: '10% OFF' },
  'socks': { color: '#BBA7D8', accent: '#302143', image: '/src/images/sock.png', label: 'SOCKS' },
  'beanie': { color: '#8899A6', accent: '#15202B', label: 'BEANIE' },
  'belt': { color: '#909090', accent: '#222222', label: 'BELT' },
  'mystery': { color: '#78C7B6', accent: '#133F3A', label: 'MYSTERY' },
  'try-again': { color: '#333333', accent: '#888888', label: 'NEXT TIME' },
}

export { UNIQUE_COUNTRIES as COUNTRIES } from './data/countries'
export type { Country } from './data/countries'

export const prizeNames: Record<PrizeId, string> = {
  grand: 'Inside Out T-shirt',
  'discount-50': '50% off',
  'discount-30': '30% off',
  'discount-10': '10% off',
  socks: 'Đôi tất / Pair of socks',
  beanie: 'Inside Out Beanie',
  belt: 'Inside Out Belt',
  mystery: 'Mystery Reward',
  'try-again': 'Try again next time',
}

export const getPrizeName = (id: PrizeId, mystery: number | null) =>
  id === 'mystery' && mystery ? `${prizeNames[id]} · ${mystery}%` : prizeNames[id]

export const translations = {
  navDate: '28 Sep 2026 · Da Nang',
  countdownTitle: 'See you when the doors open',
  days: 'Days', hours: 'Hours', minutes: 'Mins', seconds: 'Secs',
  
  aboutTitle: 'About Inside Out',
  aboutBody: 'From D13 An Thuong 34, three friends — Phu, Tai, and Luc — birthed Innoir. On that same street, with the same minds, Inside Out was born as the second child. Not a continuation, but a different chapter — a streetwear label focused on pieces that just feel right when you put them on. No sloppy materials, no copied designs — because we wear what we sell.',
  
  formKicker: 'STEP 01',
  formTitle: 'Guest Information',
  formSubtitle: 'Enter your details to unlock your lucky roll.',
  name: 'Full name', namePlaceholder: 'e.g. Alex Nguyen',
  country: 'Country', countryPlaceholder: 'Select your country',
  privacy: 'Used strictly for in-store gift verification.',
  continue: 'Unlock Roulette',
  
  wheelKicker: 'Ready, set, feel!',
  wheelTitle: 'Roll for your opening gift',
  spin: 'ROLL', spinning: 'ROLLING...',
  wheelHint: 'One turn per device.',
  alreadyUsed: 'You have already used your spin.',
  closed: 'The wheel is now closed. See you at the store!',
  
  resultWin: 'This feeling is yours!',
  resultGrand: 'WOW! You are one of today’s very luckiest guests!',
  resultLose: 'Not your lucky spin this time!',
  resultLoseBody: 'Visit us on 28 September for a 5% welcome offer.',
  giftCode: 'Gift code',
  giftNote: 'Show this code to our in-store team. It is saved on this device.',
  
  save: 'Save image', share: 'Share', close: 'Close',
  saving: 'Saving...', sharedText: 'I just won an Inside Out grand opening reward!',
  
  founded: 'Founded by', follow: 'Follow the journey',
  nameRequired: 'Please enter your name.', nameTooShort: 'Name needs at least 2 characters.',
  countryRequired: 'Please select your country.',

  feedTitle: 'Live results',
  feedEmpty: 'No one has spun yet. Be the first!',
}
