'use client'

import { useCallback } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/menuCRUD'
import { Category } from '@/types'
import { useSharedOperations } from './useSharedOperations'
import { ERROR_MESSAGES } from '@/lib/constants'

export function useCategoryOperations() {
  const { refreshCategories, handleError } = useSharedOperations()

  const handleAddCategory = useCallback(
    async (newCategory: Category) => {
      try {
        await createCategory({
          key: newCategory.key,
          label: newCategory.label,
          icon: newCategory.icon,
        })
        refreshCategories()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.CATEGORY_CREATE)
      }
    },
    [refreshCategories, handleError],
  )

  const handleCategoryUpdate = useCallback(
    async (categoryKey: string, updated: Category) => {
      try {
        await updateCategory(categoryKey, {
          label: updated.label,
          icon: updated.icon,
        })
        refreshCategories()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.CATEGORY_UPDATE)
      }
    },
    [refreshCategories, handleError],
  )

  const handleCategoryDelete = useCallback(
    async (categoryKey: string, forceDelete: boolean) => {
      try {
        await deleteCategory(categoryKey, forceDelete)
        refreshCategories()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.CATEGORY_DELETE)
      }
    },
    [refreshCategories, handleError],
  )

  return {
    handleAddCategory,
    handleCategoryUpdate,
    handleCategoryDelete,
  }
}
