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

  const selectedCountry = COUNTRIES.find(c => c.code === value)

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="country-select" ref={containerRef}>
      <button 
        type="button" 
        className="country-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-invalid={Boolean(error)}
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
        <div className="country-select-dropdown">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
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
                onClick={() => {
                  onChange(country.code)
                  setIsOpen(false)
                  setSearch('')
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
      )}
    </div>
  )
}
