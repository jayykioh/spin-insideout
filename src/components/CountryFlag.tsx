interface CountryFlagProps {
  code: string
  name?: string
  className?: string
}

export const CountryFlag = ({ code, name, className = '' }: CountryFlagProps) => {
  if (!code) return null
  const cCode = code.toLowerCase()
  
  return (
    <span className={`flag-wrapper ${className}`} aria-hidden="true">
      <img
        src={`https://flagcdn.com/24x18/${cCode}.png`}
        srcSet={`https://flagcdn.com/48x36/${cCode}.png 2x`}
        width="20"
        height="15"
        alt={name ? `${name} flag` : `${code} flag`}
        className="flag-img"
        loading="lazy"
        onError={(e) => {
          // Graceful fallback: hide broken image
          e.currentTarget.style.display = 'none'
        }}
      />
    </span>
  )
}
