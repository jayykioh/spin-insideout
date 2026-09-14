import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, useRef } from 'react'
import { Info } from 'lucide-react'
import { prizeVisuals, APP_CONFIG } from '../content'
import type { PrizeId } from '../domain/wheel'
import { generateRouletteSequence } from '../domain/wheel'
import { RewardsModal } from './RewardsModal'

interface RouletteProps {
  spinning: boolean
  disabled: boolean
  winningPrize: PrizeId | null
  hint?: string
  onSpin: () => void
  onSpinComplete: () => void
}

const ITEM_WIDTH = 184 // 180px width + 4px gap
const WIN_INDEX = 85
const TOTAL_ITEMS = 100

export const Roulette = ({ spinning, disabled, winningPrize, hint, onSpin, onSpinComplete }: RouletteProps) => {
  const reduceMotion = useReducedMotion()
  const [sequence, setSequence] = useState<PrizeId[]>([])
  const [xOffset, setXOffset] = useState(0)
  const [isIdle, setIsIdle] = useState(true)
  const [showRewards, setShowRewards] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize a random sequence when first loaded or after spinning completes
  useEffect(() => {
    if (!spinning && !winningPrize) {
      setSequence(generateRouletteSequence('mystery', TOTAL_ITEMS, WIN_INDEX))
      setXOffset(0)
      setIsIdle(true)
    }
  }, [spinning, winningPrize])

  // When a spin starts and we get the winning prize
  useEffect(() => {
    if (spinning && winningPrize && containerRef.current) {
      // Regenerate sequence with actual winning prize at WIN_INDEX
      setSequence(generateRouletteSequence(winningPrize, TOTAL_ITEMS, WIN_INDEX))
      
      const containerWidth = containerRef.current.clientWidth
      // We want the winning item to be exactly in the center of the container
      const centerOffset = containerWidth / 2
      // Calculate exact X position to land on
      // Add a slight random offset so it doesn't land exactly in the middle of the box every time (-40px to +40px)
      const randomJitter = (Math.random() - 0.5) * (ITEM_WIDTH - 20)
      
      const targetX = (WIN_INDEX * ITEM_WIDTH) + (ITEM_WIDTH / 2) - centerOffset + randomJitter
      
      setIsIdle(false)
      setXOffset(-targetX)
    }
  }, [spinning, winningPrize])

  return (
    <div className="roulette-shell">
      <div className="roulette-container" ref={containerRef}>
        <div className="center-line" aria-hidden="true" />
        
        <motion.div 
          className="roulette-track"
          initial={false}
          animate={isIdle ? { x: [0, -ITEM_WIDTH * 10] } : { x: xOffset }}
          transition={
            isIdle 
              ? { repeat: Infinity, duration: 25, ease: 'linear' }
              : { duration: spinning ? (reduceMotion ? 0 : APP_CONFIG.spinDuration) : 0, ease: [0.15, 0.9, 0.25, 1] }
          }
          onAnimationComplete={() => {
            if (spinning) {
              // Add a small delay after stopping before showing modal
              setTimeout(onSpinComplete, 800)
            }
          }}
        >
          {sequence.map((prizeId, i) => {
            const visual = prizeVisuals[prizeId]
            return (
              <div 
                key={`${i}-${prizeId}`} 
                className="roulette-item"
                style={{ 
                  '--item-bg': visual.color,
                  '--item-accent': visual.accent
                } as React.CSSProperties}
              >
                {visual.image ? (
                  <img src={visual.image} alt={visual.label} className="item-image" loading="lazy" />
                ) : (
                  <div className="item-placeholder"></div>
                )}
                <div className="item-label">{visual.label}</div>
              </div>
            )
          })}
        </motion.div>
      </div>
      
      <div className="roulette-actions">
        <motion.button
          whileTap={!disabled && !spinning ? { scale: 0.96 } : {}}
          type="button"
          className="spin-button-csgo"
          disabled={disabled || spinning}
          onClick={onSpin}
        >
          {spinning ? 'ROLLING...' : 'ROLL NOW'}
        </motion.button>
        <button type="button" className="view-rewards-btn" onClick={() => setShowRewards(true)}>
          <Info size={16} /> View Rewards
        </button>
        {hint && <p className="roulette-hint">{hint}</p>}
      </div>
      
      <RewardsModal isOpen={showRewards} onClose={() => setShowRewards(false)} />
    </div>
  )
}
