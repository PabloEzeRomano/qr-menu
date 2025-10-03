'use client'

import { useCallback } from 'react'

import { useMenuData } from '@/contexts/MenuDataProvider'
import { patchDailyMenu } from '@/lib/api/menu'
import { patchRestaurant } from '@/lib/api/restaurant'
import { ERROR_MESSAGES } from '@/lib/constants'
import { DailyMenu, Restaurant } from '@/types'

import { useErrorHandler } from './useErrorHandler'

export function useRestaurantOperations() {
  const { restaurant, dailyMenu, refreshRestaurant, refreshDailyMenu } = useMenuData()
  const { handleError } = useErrorHandler()

  const handleTitleSave = useCallback(
    async (newTitle: string) => {
      if (!restaurant) return
      try {
        await patchRestaurant({ ...restaurant, name: newTitle })
        refreshRestaurant()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.RESTAURANT_TITLE)
      }
    },
    [restaurant, handleError, refreshRestaurant],
  )

  const handleSubtitleSave = useCallback(
    async (newSubtitle: string) => {
      if (!restaurant) return
      try {
        await patchRestaurant({ ...restaurant, description: newSubtitle })
        refreshRestaurant()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.RESTAURANT_SUBTITLE)
      }
    },
    [restaurant, handleError, refreshRestaurant],
  )

  const handleDailyMenuSave = useCallback(
    async (patch: Partial<DailyMenu>) => {
      const next = { ...dailyMenu, ...patch } as DailyMenu

      try {
        await patchDailyMenu(next)
        refreshDailyMenu()
      } catch (error) {
        handleError(error, ERROR_MESSAGES.DAILY_MENU_SAVE)
      }
    },
    [dailyMenu, handleError, refreshDailyMenu],
  )

  const handleRestaurantSave = useCallback(
    async (patch: Partial<Restaurant>) => {
      try {
        await patchRestaurant(patch)
      } catch (error) {
        handleError(error, ERROR_MESSAGES.RESTAURANT_SAVE)
      }
    },
    [handleError],
  )

  return {
    handleTitleSave,
    handleSubtitleSave,
    handleDailyMenuSave,
    handleRestaurantSave,
  }
}
