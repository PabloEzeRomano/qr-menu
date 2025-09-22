'use client'

import { useCallback } from 'react'
import { createItem, updateItem, deleteItem } from '@/lib/menuCRUD'
import { MenuItem } from '@/types'
import { useMenuContext } from '@/contexts/MenuContextProvider'
import { useSharedOperations } from './useSharedOperations'
import { ERROR_MESSAGES, DEFAULT_VALUES, TEMP_ID_PREFIX } from '@/lib/constants'

export function useItemOperations() {
  const { addNewItem, removeNewItem } = useMenuContext()
  const { refreshData, handleError } = useSharedOperations()

  const createNewItem = useCallback((categoryKey: string): MenuItem => {
    return {
      id: `${TEMP_ID_PREFIX}${Date.now()}`,
      name: DEFAULT_VALUES.NEW_ITEM_NAME,
      description: DEFAULT_VALUES.NEW_ITEM_DESCRIPTION,
      price: DEFAULT_VALUES.NEW_ITEM_PRICE,
      category: categoryKey,
      tags: [],
      diet: [],
      img: DEFAULT_VALUES.PLACEHOLDER_IMAGE,
      isVisible: true,
    }
  }, [])

  const handleAddItem = useCallback(
    async (categoryKey: string) => {
      try {
        const newItem = createNewItem(categoryKey)
        addNewItem(newItem)
        return newItem
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_NEW)
      }
    },
    [createNewItem, addNewItem, handleError],
  )

  const handleSaveNewItem = useCallback(
    async (newItem: MenuItem) => {
      try {
        const { id, ...itemData } = newItem // Remove temp ID
        await createItem(itemData)
        removeNewItem(newItem.id)
        refreshData()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_CREATE)
      }
    },
    [removeNewItem, refreshData, handleError],
  )

  const handleCancelNewItem = useCallback(
    (tempId: string) => {
      removeNewItem(tempId)
    },
    [removeNewItem],
  )

  const handleItemUpdate = useCallback(
    async (updatedItem: MenuItem) => {
      try {
        const { id, ...patch } = updatedItem
        await updateItem(id, patch)
        refreshData()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_UPDATE)
      }
    },
    [refreshData, handleError],
  )

  const handleItemDelete = useCallback(
    async (itemId: string) => {
      try {
        await deleteItem(itemId)
        refreshData()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_DELETE)
      }
    },
    [refreshData, handleError],
  )

  return {
    handleAddItem,
    handleSaveNewItem,
    handleCancelNewItem,
    createNewItem,
    handleItemUpdate,
    handleItemDelete,
  }
}
