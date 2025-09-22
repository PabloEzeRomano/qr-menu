'use client'

import { useCallback } from 'react'

interface ValidationRule<T> {
  field: keyof T
  validator: (value: any) => string | null
  message: string
}

interface UseFormValidationOptions<T> {
  rules: ValidationRule<T>[]
  initialValues: T
}

export function useFormValidation<T extends Record<string, any>>({
  rules,
  initialValues,
}: UseFormValidationOptions<T>) {
  const validateField = useCallback(
    (field: keyof T, value: any) => {
      const rule = rules.find((r) => r.field === field)
      if (!rule) return null

      const error = rule.validator(value)
      return error || null
    },
    [rules],
  )

  const validateForm = useCallback(
    (values: T) => {
      const errors: Partial<Record<keyof T, string>> = {}
      let isValid = true

      rules.forEach((rule) => {
        const error = rule.validator(values[rule.field])
        if (error) {
          errors[rule.field] = error
          isValid = false
        }
      })

      return { errors, isValid }
    },
    [rules],
  )

  const getFieldError = useCallback(
    (field: keyof T, value: any) => {
      return validateField(field, value)
    },
    [validateField],
  )

  return {
    validateField,
    validateForm,
    getFieldError,
  }
}

// Common validation rules
export const commonValidators = {
  required:
    (message = 'This field is required') =>
    (value: any) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message
      }
      return null
    },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`
    }
    return null
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`
    }
    return null
  },

  min: (min: number, message?: string) => (value: number) => {
    if (value < min) {
      return message || `Must be at least ${min}`
    }
    return null
  },

  max: (max: number, message?: string) => (value: number) => {
    if (value > max) {
      return message || `Must be no more than ${max}`
    }
    return null
  },

  email:
    (message = 'Invalid email address') =>
    (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return message
      }
      return null
    },

  url:
    (message = 'Invalid URL') =>
    (value: string) => {
      try {
        if (value) new URL(value)
        return null
      } catch {
        return message
      }
    },
}
