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
  'grand':        { color: '#F5C54A', accent: '#5A3513', image: '/images/tshirt.png',     label: 'T-SHIRT' },
  'discount-50':  { color: '#F16B4E', accent: '#FFF8EC', image: '/images/50%.png',        label: '50% OFF' },
  'discount-30':  { color: '#F39A4A', accent: '#48250A',                                   label: '30% OFF' },
  'discount-10':  { color: '#A8DCC5', accent: '#173D32', image: '/images/10%.png',        label: '10% OFF' },
  'discount-8':   { color: '#E57373', accent: '#3E1010', image: '/images/8%.png',         label: '8% OFF' },
  'discount-5':   { color: '#FFB74D', accent: '#4E2C00', image: '/images/5%.png',         label: '5% OFF' },
  'discount-3':   { color: '#4FC3F7', accent: '#002E4C', image: '/images/3%.png',         label: '3% OFF' },
  'discount-2':   { color: '#81C784', accent: '#0E3613', image: '/images/2%.png',         label: '2% OFF' },
  'socks':        { color: '#BBA7D8', accent: '#302143', image: '/images/sock.png',       label: 'SOCKS' },
  'beanie':       { color: '#8899A6', accent: '#15202B', image: '/images/beanie.jpg',     label: 'BEANIE' },
  'belt':         { color: '#909090', accent: '#222222', image: '/images/belt.webp',      label: 'BELT' },
  'mystery':      { color: '#78C7B6', accent: '#133F3A', image: '/images/MYSTERY.jpg',   label: 'MYSTERY' },
  'try-again':    { color: '#555555', accent: '#888888', image: '/images/try-again.webp', label: 'NEXT TIME' },
  'discount-50k': { color: '#E57373', accent: '#3E1010', image: '/images/voucher.png',   label: '-50K' },
  'discount-80k': { color: '#F16B4E', accent: '#FFF8EC', image: '/images/voucher.png',   label: '-80K' },
  'discount-20k': { color: '#FFB74D', accent: '#4E2C00', image: '/images/voucher.png',   label: '-20K' },
  'free-item':    { color: '#78C7B6', accent: '#133F3A', image: '/images/free-item.jpg', label: 'FREE ITEM' },
  'porsche':      { color: '#C8A96E', accent: '#1A1000', image: '/images/porsche.webp',  label: 'PORSCHE' },
  'bugatti':      { color: '#1A2A6E', accent: '#000000', image: '/images/bugatti.png',   label: 'BUGATTI' },
  'ps5':          { color: '#FFFFFF', accent: '#000000', image: '/images/ps5.png',        label: 'PS5' },
  'iphone18':     { color: '#909090', accent: '#222222', image: '/images/iphone18.jpg',  label: 'IPHONE 18' },
  'macbook':      { color: '#E0E0E0', accent: '#444444', image: '/images/macbook.png',   label: 'MACBOOK' },
}

export { UNIQUE_COUNTRIES as COUNTRIES } from './data/countries'
export type { Country } from './data/countries'

export const prizeNames: Record<PrizeId, string> = {
  grand: 'Inside Out T-shirt',
  'discount-50': '50% off',
  'discount-30': '30% off',
  'discount-10': '10% off',
  'discount-8': '8% off',
  'discount-5': '5% off',
  'discount-3': '3% off',
  'discount-2': '2% off',
  socks: 'Inside Out Socks',
  beanie: 'Inside Out Beanie',
  belt: 'Inside Out Belt',
  mystery: 'Mystery Reward',
  'try-again': 'Try again next time',
  'discount-50k': 'Giảm 50.000vnđ',
  'discount-80k': 'Giảm 80.000vnđ',
  'discount-20k': 'Giảm 20.000vnđ',
  'free-item': '1 item may mắn của Inside Out',
  'porsche': 'Xe Porsche',
  'bugatti': 'Xe Bugatti',
  'ps5': 'PS5',
  'iphone18': 'iPhone 18 Pro Max',
  'macbook': 'Macbook Pro',
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
  wheelHint: 'One turn per guest.',
  alreadyUsed: 'Turn completed. Ready for next guest.',
  closed: 'The wheel is now closed. See you at the store!',
  
  resultWin: 'This feeling is yours!',
  resultGrand: 'WOW! You are one of today’s very luckiest guests!',
  resultLose: 'Not your lucky spin this time!',
  resultLoseBody: 'See you next time at Inside Out! 👋',
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
