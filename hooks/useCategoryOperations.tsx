'use client'

import { useCallback } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/api/menu'
import { Category } from '@/types'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useErrorHandler } from './useErrorHandler'
import { ERROR_MESSAGES } from '@/lib/constants'

export function useCategoryOperations() {
  const { refreshCategories } = useMenuData()
  const { handleError } = useErrorHandler()

  const handleAddCategory = useCallback(
    async (newCategory: Category) => {
      try {
        await createCategory({
          key: newCategory.key,
          label: newCategory.label,
          icon: newCategory.icon,
          isVisible: true,
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
          isVisible: updated.isVisible,
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
