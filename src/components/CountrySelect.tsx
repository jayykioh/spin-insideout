import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
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
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          </span>
        ) : (
          <span className="placeholder">Select your country</span>
        )}
        <ChevronDown size={18} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="country-select-dropdown">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search country..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
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
                {country.code === value && <Check size={16} className="check" />}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="empty-state">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
