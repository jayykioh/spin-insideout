import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { prizeVisuals, translations } from '../content'

interface RewardsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RewardsModal = ({ isOpen, onClose }: RewardsModalProps) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-backdrop" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            className="result-modal dark-mode rewards-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rewards-title"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label={translations.close}><X size={20} /></button>
            <div className="rewards-modal-content">
              <h2 id="rewards-title" className="rewards-title">All Rewards</h2>
              <p className="rewards-subtitle">Discover the exclusive prizes you can win in our Grand Opening.</p>
              
              <div className="rewards-grid">
                {Object.entries(prizeVisuals).map(([id, visual]) => {
                  if (id === 'try-again') return null
                  return (
                    <div key={id} className="reward-card" style={{ borderColor: visual.color }}>
                      <div className="reward-visual" style={{ backgroundColor: `${visual.color}15` }}>
                        {visual.image ? (
                          <img src={visual.image} alt={visual.label} className="reward-image" />
                        ) : (
                          <div className="reward-placeholder"></div>
                        )}
                      </div>
                      <div className="reward-info">
                        <span className="reward-name" style={{ color: visual.color }}>{visual.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
