'use client'

import { useCallback } from 'react'

import { useMenuContext } from '@/contexts/MenuContextProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { createItem, deleteItem,updateItem } from '@/lib/api/menu'
import { DEFAULT_VALUES, ERROR_MESSAGES, TEMP_ID_PREFIX } from '@/lib/constants'
import { MenuItem } from '@/types'

import { useErrorHandler } from './useErrorHandler'

export function useItemOperations() {
  const { addNewItem, removeNewItem } = useMenuContext()
  const { refreshItems } = useMenuData()
  const { handleError } = useErrorHandler()

  const createNewItem = useCallback((categoryKey: string): MenuItem => {
    return {
      id: `${TEMP_ID_PREFIX}${Date.now()}`,
      name: DEFAULT_VALUES.NEW_ITEM_NAME,
      description: DEFAULT_VALUES.NEW_ITEM_DESCRIPTION,
      price: DEFAULT_VALUES.NEW_ITEM_PRICE,
      category: categoryKey,
      tagIds: [],
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
        refreshItems()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_CREATE)
      }
    },
    [removeNewItem, refreshItems, handleError],
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
        refreshItems()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_UPDATE)
      }
    },
    [refreshItems, handleError],
  )

  const handleItemDelete = useCallback(
    async (itemId: string) => {
      try {
        await deleteItem(itemId)
        refreshItems()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.ITEM_DELETE)
      }
    },
    [refreshItems, handleError],
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
