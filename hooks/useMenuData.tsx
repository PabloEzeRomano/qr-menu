'use client'

import { getDailyMenu, getRestaurant, listCategories, listFilters, listItems } from '@/lib/menuCRUD'
import type { Category, DailyMenu, Filter, MenuItem, Restaurant } from '@/types'
import { useCallback, useEffect, useState } from 'react'

type State = {
  categories: Category[]
  filters: Filter[]
  items: MenuItem[]
  dailyMenu: DailyMenu | null
  restaurant: Restaurant | null
}

const initialState = {
  categories: [],
  filters: [],
  items: [],
  dailyMenu: null,
  restaurant: null,
}

export function useMenuData() {
  const [state, setState] = useState<State>(initialState)
  const [loading, setLoading] = useState(false)

  const fetchRestaurant = async () => {
    const restaurant = await getRestaurant()
    setState((prev) => ({
      ...prev,
      restaurant,
    }))
  }

  const fetchCategories = async () => {
    const categories = await listCategories()
    setState((prev) => ({
      ...prev,
      categories,
    }))
  }

  const fetchFilters = async () => {
    const filters = await listFilters()
    setState((prev) => ({
      ...prev,
      filters,
    }))
  }

  const fetchItems = useCallback(async (showAll = false) => {
    const items = await listItems(showAll)
    setState((prev) => ({
      ...prev,
      items,
    }))
  }, [])

  const fetchDailyMenu = async () => {
    const dailyMenu = await getDailyMenu()
    setState((prev) => ({
      ...prev,
      dailyMenu,
    }))
  }

  const refetch = (showAll = false) => {
    setLoading(true)
    fetchCategories()
    fetchFilters()
    fetchItems(showAll)
    fetchDailyMenu()
    fetchRestaurant()
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  const refreshItems = useCallback(
    (showAll = false) => {
      fetchItems(showAll)
    },
    [fetchItems],
  )

  return {
    ...state,
    loading,
    refreshItems,
  }
}
