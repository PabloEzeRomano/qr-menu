'use client'

import { useState, useCallback } from 'react'

interface UseEditModeOptions<T> {
  initialValue: T
  onSave?: (value: T) => void | Promise<void>
  onCancel?: () => void
  validate?: (value: T) => string | null
}

export function useEditMode<T>({
  initialValue,
  onSave,
  onCancel,
  validate,
}: UseEditModeOptions<T>) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState<T>(initialValue)
  const [error, setError] = useState<string | null>(null)

  const startEditing = useCallback(() => {
    setTempValue(initialValue)
    setError(null)
    setIsEditing(true)
  }, [initialValue])

  const cancelEditing = useCallback(() => {
    setTempValue(initialValue)
    setError(null)
    setIsEditing(false)
    onCancel?.()
  }, [initialValue, onCancel])

  const saveChanges = useCallback(async () => {
    if (validate) {
      const validationError = validate(tempValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    try {
      await onSave?.(tempValue)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving changes')
    }
  }, [tempValue, onSave, validate])

  const updateTempValue = useCallback(
    (updates: Partial<T>) => {
      setTempValue((prev) => ({ ...prev, ...updates }))
      if (error) setError(null) // Clear error when user starts typing
    },
    [error],
  )

  const hasChanges = useCallback(() => {
    return JSON.stringify(tempValue) !== JSON.stringify(initialValue)
  }, [tempValue, initialValue])

  return {
    isEditing,
    tempValue,
    error,
    startEditing,
    cancelEditing,
    saveChanges,
    updateTempValue,
    hasChanges,
    setTempValue,
  }
}
