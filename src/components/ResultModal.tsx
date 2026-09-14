import { useRef, useState } from 'react'
import { Download, Share2, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getPrizeName, translations, prizeVisuals } from '../content'
import type { SpinResult } from '../domain/spinStore'

interface ResultModalProps {
  result: SpinResult | null
  onClose: () => void
}

const bigWins = new Set(['grand', 'discount-50', 'discount-30'])

export const ResultModal = ({ result, onClose }: ResultModalProps) => {
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

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

  const isLoss = result?.prizeId === 'try-again'
  const showConfetti = result && bigWins.has(result.prizeId) && !reduceMotion
  const visual = result ? prizeVisuals[result.prizeId] : null

  return (
    <AnimatePresence>
      {result && visual ? (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="presentation">
          <motion.div
            className="result-modal dark-mode"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            {showConfetti ? <div className="confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div> : null}
            <button className="modal-close" onClick={onClose} aria-label={translations.close}><X size={20} /></button>
            <div className="result-capture" ref={cardRef}>
              {visual.image ? (
                <img
                  src={visual.image}
                  alt={visual.label}
                  className={`result-image ${isLoss ? 'result-image--soft' : ''}`}
                />
              ) : (
                <div className="result-image-placeholder"></div>
              )}
              <p className="eyebrow">Inside Out · 28 Sep 2026</p>
              <h2 id="result-title">{result.prizeId === 'grand' ? translations.resultGrand : isLoss ? translations.resultLose : translations.resultWin}</h2>
              <p className="result-prize" style={{ color: visual.color, backgroundColor: `${visual.color}15`, border: `1px solid ${visual.color}30` }}>
                {getPrizeName(result.prizeId, result.mysteryDiscount)}
              </p>
              {isLoss ? <p className="result-copy">{translations.resultLoseBody}</p> : (
                <>
                  <p className="code-label">{translations.giftCode}</p>
                  <strong className="voucher-code" style={{ color: visual.color }}>{result.code}</strong>
                  <p className="result-copy">{translations.giftNote}</p>
                </>
              )}
            </div>
            <div className="result-actions">
              <button className="button button--dark" onClick={saveImage} disabled={saving}><Download size={18} />{saving ? translations.saving : translations.save}</button>
              <button className="button button--outline" onClick={share}><Share2 size={18} />{translations.share}</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
