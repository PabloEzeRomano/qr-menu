import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'green' | 'blue' | 'purple' | 'red'
  label?: string
  className?: string
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'green',
  label,
  className = '',
}: SwitchProps) {
  const sizeClasses = {
    sm: 'h-5 w-11',
    md: 'h-6 w-14',
    lg: 'h-7 w-16',
  }

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const thumbTranslateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-6' : 'translate-x-1',
  }

  const colorClasses = {
    green: checked ? 'bg-green-500' : 'bg-gray-600',
    blue: checked ? 'bg-blue-500' : 'bg-gray-600',
    purple: checked ? 'bg-purple-500' : 'bg-gray-600',
    red: checked ? 'bg-red-500' : 'bg-gray-600',
  }

  const focusRingClasses = {
    green: 'focus:ring-green-400',
    blue: 'focus:ring-blue-400',
    purple: 'focus:ring-purple-400',
    red: 'focus:ring-red-400',
  }

  const switchClasses = `
    relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${focusRingClasses[color]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  const thumbClasses = `
    inline-block transform rounded-full bg-white transition-transform
    ${thumbSizeClasses[size]}
    ${thumbTranslateClasses[size]}
  `.trim()

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div className="flex items-center">
      {label && <label className="mr-3 text-sm font-medium text-gray-700">{label}</label>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={switchClasses}
      >
        <span className={thumbClasses} />
      </button>
    </div>
  )
}
