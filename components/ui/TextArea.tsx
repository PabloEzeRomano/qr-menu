import React from 'react'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export default function TextArea({
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}: TextAreaProps) {
  const textareaClasses = `
    w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
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
      <textarea className={textareaClasses} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
