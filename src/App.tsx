import { FormEvent, useEffect, useState } from 'react'
import { ArrowDown, Instagram } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { APP_CONFIG, translations, COUNTRIES } from './content'
import { Roulette } from './components/Roulette'
import { ResultModal } from './components/ResultModal'
import { CountrySelect } from './components/CountrySelect'
import { CountryFlag } from './components/CountryFlag'
import { ResultsFeed } from './components/ResultsFeed'
import { postSpinToSheet } from './lib/sheetsApi'
import {
  canSpin,
  getDailyGrandPrizeCount,
  getDeviceId,
  saveSpinResult,
  type SpinResult,
} from './domain/spinStore'
import {
  isSpinPermitted,
  secureRandom,
  selectPrize,
  validateParticipant,
  type Participant,
  type ParticipantError,
  createVoucherCode,
} from './domain/wheel'

const getCountdown = () => {
  const difference = Math.max(0, new Date(APP_CONFIG.openingDate).getTime() - Date.now())
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  }
}

const getEventDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())

const App = () => {
  const [countdown, setCountdown] = useState(getCountdown)
  const [participant, setParticipant] = useState<Participant>({ name: '', country: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Participant, ParticipantError>>>({})
  const [registered, setRegistered] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [pendingResult, setPendingResult] = useState<SpinResult | null>(null)
  const [visibleResult, setVisibleResult] = useState<SpinResult | null>(null)
  const [notice, setNotice] = useState('')
  const [deviceId] = useState(getDeviceId)
  const reduceMotion = useReducedMotion()

  const eligible = canSpin(deviceId)
  const spinPermitted = isSpinPermitted({
    registered,
    spinning,
    closed: APP_CONFIG.spinsClosed,
    eligible,
    hasSpun,
  })

  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!eligible) {
      setNotice(translations.alreadyUsed)
      setHasSpun(true)
    }
  }, [eligible])

  const submitParticipant = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateParticipant(participant)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (!canSpin(deviceId)) {
      setNotice(translations.alreadyUsed)
      return
    }

    setNotice('')
    setRegistered(true)
    window.setTimeout(() => document.getElementById('roulette-section')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 50)
  }

  const spin = () => {
    if (!spinPermitted) return

    let prizeId = selectPrize(secureRandom())
    if (prizeId === 'grand' && getDailyGrandPrizeCount(getEventDate()) >= APP_CONFIG.dailyGrandPrizeLimit) {
      prizeId = 'try-again'
    }

    const mysteryDiscount = prizeId === 'mystery' ? 5 + Math.floor(secureRandom() * 36) : null
    
    const result: SpinResult = {
      code: createVoucherCode(),
      createdAt: new Date().toISOString(),
      deviceId,
      mysteryDiscount,
      name: participant.name.trim(),
      country: participant.country,
      prizeId,
    }

    setPendingResult(result)
    setSpinning(true)
  }

  const finishSpin = async () => {
    if (!spinning || !pendingResult) return
    
    // Save to local storage first (fallback)
    saveSpinResult(pendingResult)
    setHasSpun(true)
    
    // Attempt to post to sheet in background
    postSpinToSheet(pendingResult).catch(console.error)
    
    setSpinning(false)
    setVisibleResult(pendingResult)
    setNotice(translations.alreadyUsed)
    setPendingResult(null)
  }

  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.65 },
  }

  const countdownItems = [
    [countdown.days, translations.days], [countdown.hours, translations.hours],
    [countdown.minutes, translations.minutes], [countdown.seconds, translations.seconds],
  ]

  return (
    <div className="site-shell dark-theme">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Inside Out home"><span>IN</span><b>OUT</b></a>
        <p className="nav-date">{translations.navDate}</p>
        <div /> {/* Empty div for grid alignment */}
      </header>

      <main id="top">
        <section className="countdown-strip" aria-label={translations.countdownTitle}>
          <p>{translations.countdownTitle}</p>
          <div className="countdown-values">{countdownItems.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
        </section>

        <section className="about-section">
          <motion.div className="about-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2>{translations.aboutTitle}</h2>
            <p>{translations.aboutBody}</p>
          </motion.div>
        </section>

        <section className="form-section" id="form-section">
          <motion.div className="form-wrapper" {...reveal}>
            <div className="section-heading centered">
              <span className="eyebrow">{translations.formKicker}</span>
              <h2>{translations.formTitle}</h2>
              <p className="section-subtext">{translations.formSubtitle}</p>
            </div>
            
            {registered ? (
              <div className="verified-pass">
                <div className="verified-pass-main">
                  <div className="verified-status">
                    <span className="status-dot" aria-hidden="true" />
                    <span>GUEST VERIFIED</span>
                  </div>
                  <div className="verified-info">
                    <strong className="verified-name">{participant.name}</strong>
                    <div className="verified-country">
                      <CountryFlag code={participant.country} />
                      <span>{COUNTRIES.find(c => c.code === participant.country)?.name || participant.country}</span>
                    </div>
                  </div>
                </div>
                
                <div className="verified-actions">
                  {!hasSpun && (
                    <button type="button" className="verified-edit-btn" onClick={() => setRegistered(false)}>
                      Edit Details
                    </button>
                  )}
                  <a href="#roulette-section" className="verified-scroll-link">
                    <span>Ready to roll</span>
                    <ArrowDown size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <form className="entry-form" onSubmit={submitParticipant} noValidate>
                <div className="form-fields">
                  <label>
                    <span>{translations.name}</span>
                    <input 
                      value={participant.name} 
                      onChange={(e) => setParticipant({ ...participant, name: e.target.value })} 
                      placeholder={translations.namePlaceholder} 
                      autoComplete="name" 
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name ? <small>{translations[errors.name]}</small> : null}
                  </label>
                  
                  <label>
                    <span>{translations.country}</span>
                    <CountrySelect 
                      value={participant.country}
                      onChange={(val) => setParticipant({ ...participant, country: val })}
                      error={errors.country}
                    />
                    {errors.country ? <small>{translations[errors.country]}</small> : null}
                  </label>
                </div>

                <div className="form-footer">
                  <button className="button button--primary form-submit" type="submit">
                    {translations.continue} <ArrowDown size={16} />
                  </button>
                  <p className="privacy-note">{translations.privacy}</p>
                </div>
                
                {notice && <p className="notice" role="status">{notice}</p>}
              </form>
            )}
          </motion.div>
        </section>

        <section className="roulette-section" id="roulette-section">
          <motion.div className={`roulette-wrapper ${registered ? 'active' : 'locked'}`} {...reveal}>
            <div className="section-heading centered">
              <h2>{translations.wheelTitle}</h2>
              <p className="section-subtext">
                {registered 
                  ? 'Roulette unlocked. Hit ROLL to spin for your opening reward.' 
                  : 'Complete your information above to unlock the roulette.'}
              </p>
            </div>
            
            <Roulette 
              spinning={spinning} 
              disabled={!spinPermitted} 
              winningPrize={pendingResult?.prizeId || null}
              hint={APP_CONFIG.spinsClosed ? translations.closed : notice || translations.wheelHint}
              onSpin={spin} 
              onSpinComplete={finishSpin} 
            />
          </motion.div>
        </section>

        <ResultsFeed />
      </main>

      <footer>
        <div className="brand brand--footer"><span>IN</span><b>OUT</b></div>
        <p>{translations.founded}<br /><strong>Phu Nguyen · Luc Doan · Tai Nguyen</strong></p>
        <a href="#social" aria-label={translations.follow}><Instagram size={18} />{translations.follow}</a>
      </footer>
      
      <ResultModal result={visibleResult} onClose={() => setVisibleResult(null)} />
    </div>
  )
}

export default App
