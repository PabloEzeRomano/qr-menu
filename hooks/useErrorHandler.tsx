'use client'

import { useCallback, useState } from 'react'

export interface ErrorState {
  message: string | null
  type: 'error' | 'warning' | 'info'
  isVisible: boolean
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    message: null,
    type: 'error',
    isVisible: false,
  })

  const showError = useCallback((message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setError({
      message,
      type,
      isVisible: true,
    })

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError((prev) => ({ ...prev, isVisible: false }))
    }, 5000)
  }, [])

  const hideError = useCallback(() => {
    setError((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const handleError = useCallback(
    (error: any, defaultMessage: string) => {
      console.error('Operation failed:', error)
      const message = error?.message || defaultMessage
      showError(message, 'error')
    },
    [showError],
  )

  return {
    error,
    showError,
    hideError,
    handleError,
  }
}
