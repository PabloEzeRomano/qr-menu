'use client'

import { useCallback } from 'react'
import { uploadItemImage } from '@/lib/uploadImage'
import { useSharedOperations } from './useSharedOperations'
import { ERROR_MESSAGES } from '@/lib/constants'

export function useImageOperations() {
  const { handleError } = useSharedOperations()

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

  return { handleImageUpload }
}
