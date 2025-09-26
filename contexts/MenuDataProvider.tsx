'use client'

import { createContext, useContext, useEffect, useState, useRef, memo, useCallback } from 'react'
import { getDailyMenu, listCategories, listItems } from '@/lib/api/menu'
import { getRestaurant } from '@/lib/api/restaurant'
import { listFilters } from '@/lib/api/filters'
import type { Category, DailyMenu, Filter, MenuItem, Restaurant } from '@/types'
import { useAuth } from '@/contexts/AuthContextProvider'

type MenuDataState = {
  categories: Category[]
  filters: Filter[]
  items: MenuItem[]
  dailyMenu: DailyMenu | null
  restaurant: Restaurant | null
  loading: boolean
}

type MenuDataContextType = MenuDataState & {
  refreshItems: (showAll?: boolean) => Promise<void>
  refreshCategories: () => Promise<void>
  refreshFilters: () => Promise<void>
  refreshDailyMenu: () => Promise<void>
  refreshRestaurant: () => Promise<void>
}

const MenuDataContext = createContext<MenuDataContextType>({
  categories: [],
  filters: [],
  items: [],
  dailyMenu: null,
  restaurant: null,
  loading: false,
  refreshItems: async () => {},
  refreshCategories: async () => {},
  refreshFilters: async () => {},
  refreshDailyMenu: async () => {},
  refreshRestaurant: async () => {},
})

const MenuDataProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<MenuDataState>({
    categories: [],
    filters: [],
    items: [],
    dailyMenu: null,
    restaurant: null,
    loading: false,
  })

  const { loading: authLoading } = useAuth()

  const isInitialized = useRef(false)

  // Initial fetch when component mounts - only once
  useEffect(() => {
    if (authLoading || isInitialized.current) {
      return
    }

    isInitialized.current = true

    const loadInitialData = async () => {
      setState((prev) => ({ ...prev, loading: true }))
      try {
        const [categories, filters, items, dailyMenu, restaurant] = await Promise.all([
          listCategories(),
          listFilters(),
          listItems(true), // Always fetch all items (including hidden)
          getDailyMenu(),
          getRestaurant(),
        ])

        setState({
          categories,
          filters,
          items,
          dailyMenu,
          restaurant,
          loading: false,
        })
      } catch (error) {
        console.error('Error loading initial menu data:', error)
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    loadInitialData()
  }, [authLoading]) // Only depend on authLoading

  const refreshItems = useCallback(async () => {
    const items = await listItems(true) // Always fetch all items
    setState((prev) => ({
      ...prev,
      items,
    }))
  }, [])

  const refreshCategories = useCallback(async () => {
    const categories = await listCategories()
    setState((prev) => ({
      ...prev,
      categories,
    }))
  }, [])

  const refreshFilters = useCallback(async () => {
    const filters = await listFilters()
    setState((prev) => ({
      ...prev,
      filters,
    }))
  }, [])

  const refreshDailyMenu = useCallback(async () => {
    const dailyMenu = await getDailyMenu()
    setState((prev) => ({
      ...prev,
      dailyMenu,
    }))
  }, [])

  const refreshRestaurant = useCallback(async () => {
    const restaurant = await getRestaurant()
    setState((prev) => ({
      ...prev,
      restaurant,
    }))
  }, [])

  return (
    <MenuDataContext.Provider
      value={{
        ...state,
        refreshItems,
        refreshCategories,
        refreshFilters,
        refreshDailyMenu,
        refreshRestaurant,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  )
}

export const useMenuData = () => useContext(MenuDataContext)

export const MenuDataProvider = memo(MenuDataProviderComponent)
