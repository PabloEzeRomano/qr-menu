'use client'

import { useMemo, useState } from 'react'
import { Category, Filter, MenuItem } from '@/types'

type Predicate = { tag?: string; diet?: string }

function matches(item: { tags?: string[]; diet?: string[] }, f?: Predicate) {
  if (!f || (!f.tag && !f.diet)) return true

  const tags = item.tags ?? []
  const diet = item.diet ?? []

  if (f.tag && tags.includes(f.tag)) return true
  if (f.diet && diet.includes(f.diet)) return true

  return false
}

export function useMenuFilters(items: MenuItem[], filters: Filter[]) {
  const [activeFilter, setActiveFilter] = useState('all')

  const currentFilter = useMemo(
    () => filters.find((f) => f.key === activeFilter),
    [filters, activeFilter],
  )

  const filteredItems = useMemo(() => {
    if (!items) return []
    return items.filter((item) => matches(item, currentFilter?.predicate))
  }, [items, currentFilter])

  const filteredCategories = useMemo(() => {
    return (categories: Category[], newItems: MenuItem[]) => {
      return categories.map((category: Category) => {
        const existingItems = filteredItems.filter((i: MenuItem) => i.category === category.key)
        const newItemsForCategory = newItems.filter((i: MenuItem) => i.category === category.key)
        const allItems = [...existingItems, ...newItemsForCategory]
        return { category, items: allItems }
      })
    }
  }, [filteredItems])

  return {
    activeFilter,
    setActiveFilter,
    currentFilter,
    filteredItems,
    filteredCategories,
  }
}
