'use client'

import { useCallback } from 'react'

import { uploadItemImage } from '@/lib/api/menu'
import { patchRestaurantBackground } from '@/lib/api/restaurant'
import { ERROR_MESSAGES } from '@/lib/constants'

import { useErrorHandler } from './useErrorHandler'

export function useImageOperations() {
  const { handleError } = useErrorHandler()

  const handleImageUpload = useCallback(
    async (file: File, itemId: string): Promise<string> => {
      try {
        const url = await uploadItemImage(file, itemId)
        return url ?? ''
      } catch (error) {
        handleError(error, ERROR_MESSAGES.IMAGE_UPLOAD)
        return ''
      }
    },
    [handleError],
  )

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await patchRestaurantBackground(formData)
        return response.url
      } catch (error) {
        handleError(error, ERROR_MESSAGES.IMAGE_UPLOAD)
        throw error
      }
    },
    [handleError],
  )

  return { handleImageUpload, uploadImage }
}
