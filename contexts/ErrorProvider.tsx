'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useErrorHandler, ErrorState } from '@/hooks/useErrorHandler'
import Toast from '@/components/Toast'

interface ErrorContextType {
  error: ErrorState
  showError: (message: string, type?: 'error' | 'warning' | 'info') => void
  hideError: () => void
  handleError: (error: any, defaultMessage: string) => void
}

const ErrorContext = createContext<ErrorContextType | null>(null)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const errorHandler = useErrorHandler()

  return (
    <ErrorContext.Provider value={errorHandler}>
      {children}
      <Toast error={errorHandler.error} onClose={errorHandler.hideError} />
    </ErrorContext.Provider>
  )
}

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider')
  }
  return context
}
