'use client'

import { useCallback, useState } from 'react'

import { useErrorHandler } from './useErrorHandler'

interface UseAsyncOperationOptions {
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function useAsyncOperation<T extends any[]>(
  operation: (...args: T) => Promise<void>,
  errorMessage: string,
  options: UseAsyncOperationOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false)
  const { handleError } = useErrorHandler()

  const execute = useCallback(
    async (...args: T) => {
      setIsLoading(true)
      try {
        await operation(...args)
        options.onSuccess?.()
      } catch (error) {
        handleError(error, errorMessage)
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [operation, errorMessage, handleError, options],
  )

  return {
    execute,
    isLoading,
  }
}
