import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { fetchFeedFromSheet, type FeedItem } from '../lib/sheetsApi'
import { translations, prizeVisuals } from '../content'
import type { PrizeId } from '../domain/wheel'
import { CountryFlag } from './CountryFlag'

export const ResultsFeed = () => {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const loadFeed = async () => {
      const results = await fetchFeedFromSheet()
      if (mounted) {
        setFeed(results)
        setLoading(false)
      }
    }
    
    // Initial load
    loadFeed()
    
    // Poll every 10 seconds
    const interval = setInterval(loadFeed, 10000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const formatTimeAgo = (isoString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return 'recently'
  }

  const formatName = (fullName: string) => fullName.trim()

  return (
    <section className="results-feed">
      <div className="section-heading">
        <h2>{translations.feedTitle}</h2>
      </div>
      
      <div className="feed-container">
        {loading && feed.length === 0 ? (
          <div className="feed-loading">Loading live results...</div>
        ) : feed.length === 0 ? (
          <div className="feed-empty">{translations.feedEmpty}</div>
        ) : (
          <div className="feed-list">
            <AnimatePresence initial={false}>
              {feed.map((item) => {
                const prize = prizeVisuals[item.prizeId as PrizeId]
                return (
                  <motion.div 
                    key={item.id}
                    className="feed-item"
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="feed-user">
                      <CountryFlag code={item.country} className="feed-flag" />
                      <span className="feed-name">{formatName(item.name)}</span>
                    </div>
                    <div className="feed-prize" style={{ color: prize?.color || '#fff' }}>
                      {prize?.label || item.prizeId}
                    </div>
                    <div className="feed-time">
                      {formatTimeAgo(item.createdAt)}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
