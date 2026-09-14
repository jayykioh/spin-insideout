import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { Download, Share2, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getPrizeName, translations, prizeVisuals } from '../content'
import type { SpinResult } from '../domain/spinStore'

interface ResultModalProps {
  result: SpinResult | null
  onClose: () => void
}

const bigWins = new Set(['grand', 'discount-50', 'discount-30', 'discount-50k', 'discount-80k', 'free-item'])

export const ResultModal = ({ result, onClose }: ResultModalProps) => {
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const isLoss = result?.prizeId === 'try-again'
  const isWin = result && !isLoss

  // Trigger fireworks confetti for every result
  useEffect(() => {
    if (result && !reduceMotion) {
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999, colors: ['#f28b24', '#ffffff', '#13151b', '#E57373', '#FFB74D'] }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()
        if (timeLeft <= 0) return clearInterval(interval)

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)
      
      return () => clearInterval(interval)
    }
  }, [result, reduceMotion])

  const saveImage = async () => {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#111', scale: 2 })
      const link = document.createElement('a')
      link.download = `inside-out-${result?.code}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  const share = async () => {
    if (!result) return
    const text = `${translations.sharedText} ${getPrizeName(result.prizeId, result.mysteryDiscount)} · ${result.code}`
    if (navigator.share) await navigator.share({ title: 'Inside Out Opening', text })
    else await navigator.clipboard.writeText(text)
  }

  const visual = result ? prizeVisuals[result.prizeId] : null

  return (
    <AnimatePresence>
      {result && visual ? (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="presentation" onClick={onClose}>
          <motion.div
            className="result-modal dark-mode"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label={translations.close}><X size={20} /></button>
            <div className="result-card" ref={cardRef}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 600, color: '#fff' }}>{result.name}</span>
                <span style={{ color: '#888', fontWeight: 500, fontSize: '0.95rem' }}>({result.country})</span>
              </div>
              <p className="result-kicker" style={{ color: visual.color, fontSize: 'clamp(0.85rem, 2.8vw, 1.05rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isLoss ? translations.resultLose : 'Congratulations! You won:'}
              </p>
              <h2 id="result-title" className="result-name" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: '6px 0 14px', lineHeight: 1.15, color: '#fff' }}>
                {getPrizeName(result.prizeId, result.mysteryDiscount)}
              </h2>
              
              {visual.image ? (
                <img
                  src={visual.image}
                  alt={visual.label}
                  className={`result-image ${isLoss ? 'result-image--soft' : ''}`}
                  style={{ marginBottom: '14px' }}
                />
              ) : (
                <div className="result-image-placeholder" style={{ marginBottom: '14px' }}></div>
              )}
              
              {isLoss ? (
                <p className="result-copy">{translations.resultLoseBody}</p>
              ) : (
                <div style={{ backgroundColor: '#1a1c24', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="code-label" style={{ marginBottom: '4px' }}>{translations.giftCode}</p>
                  <strong className="voucher-code" style={{ color: visual.color, fontSize: 'clamp(1.4rem, 5.5vw, 1.8rem)', letterSpacing: '0.08em' }}>{result.code}</strong>
                  <p className="result-copy" style={{ marginTop: '8px', fontSize: '0.85rem', color: '#9ba1ad' }}>{translations.giftNote}</p>
                </div>
              )}
            </div>
            <div className="result-actions">
              <button className="button button--dark" onClick={saveImage} disabled={saving}><Download size={18} />{saving ? translations.saving : translations.save}</button>
              <button className="button button--outline" onClick={share}><Share2 size={18} />{translations.share}</button>
            </div>
            <button type="button" className="button button--primary next-guest-btn" onClick={onClose}>
              Done · Next Guest Roll →
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
