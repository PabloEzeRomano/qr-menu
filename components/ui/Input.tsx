import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export default function Input({
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600
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
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
