import React from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  containerClassName?: string
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  containerClassName = '',
  className = '',
  ...props
}: SelectProps) {
  const selectClasses = `
    w-full px-3 py-2 border border-gray-300 bg-white text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `.trim()

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
