import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check, X } from 'lucide-react'
import { COUNTRIES } from '../content'
import { CountryFlag } from './CountryFlag'

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export const CountrySelect = ({ value, onChange, error }: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTouchTimeRef = useRef(0)

  const selectedCountry = COUNTRIES.find(c => c.code === value)

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectCountry = (countryCode: string) => {
    onChange(countryCode)
    setIsOpen(false)
    setSearch('')
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutside)
      document.addEventListener('touchstart', handleOutside, { passive: true })
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Focus search input on desktop only to avoid mobile keyboard popups and layout jumps
  useEffect(() => {
    if (isOpen) {
      const isTouch = typeof window !== 'undefined' && 
        (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
      if (!isTouch && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen])

  return (
    <div className={`country-select ${isOpen ? 'open' : ''}`} ref={containerRef}>
      <button 
        type="button" 
        className="country-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-invalid={Boolean(error)}
        aria-expanded={isOpen}
      >
        {selectedCountry ? (
          <span className="selected-value">
            <CountryFlag code={selectedCountry.code} name={selectedCountry.name} />
            <span className="name">{selectedCountry.name}</span>
            <span className="code-pill">{selectedCountry.code}</span>
          </span>
        ) : (
          <span className="placeholder">Select your country</span>
        )}
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="country-select-backdrop" 
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
          <div className="country-select-dropdown">
            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search by name or code..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearch('')
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="country-list">
              {filteredCountries.map(country => (
                <button
                  key={country.code}
                  type="button"
                  className={`country-item ${country.code === value ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault()
                  }}
                  onTouchStart={(e) => {
                    const t = e.touches[0]
                    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() }
                  }}
                  onTouchEnd={(e) => {
                    if (!touchStartRef.current) return
                    const t = e.changedTouches[0]
                    const dx = Math.abs(t.clientX - touchStartRef.current.x)
                    const dy = Math.abs(t.clientY - touchStartRef.current.y)
                    const dt = Date.now() - touchStartRef.current.time
                    touchStartRef.current = null

                    if (dx < 10 && dy < 10 && dt < 500) {
                      e.preventDefault()
                      e.stopPropagation()
                      lastTouchTimeRef.current = Date.now()
                      handleSelectCountry(country.code)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (Date.now() - lastTouchTimeRef.current < 400) return
                    handleSelectCountry(country.code)
                  }}
                >
                  <CountryFlag code={country.code} name={country.name} />
                  <span className="name">{country.name}</span>
                  <span className="code-pill">{country.code}</span>
                  {country.code === value && <Check size={14} className="check" />}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="empty-state">No country matching "{search}"</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
