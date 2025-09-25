'use client'

import { useMemo, useState } from 'react'
import { Category, MenuItem, FilterCondition, FilterPredicate } from '@/types'
import { useTags } from '@/contexts/TagsProvider'
import { useFilters } from '@/contexts/FiltersProvider'

function evaluateCondition(item: MenuItem, condition: FilterCondition, tags: any[]): boolean {
  const { field, operator, value } = condition

  switch (field) {
    case 'tagIds':
      const itemTagIds = item.tagIds || []
      switch (operator) {
        case 'contains':
          // If value is a tag ID, check directly
          if (typeof value === 'string' && value.startsWith('tag_')) {
            return itemTagIds.includes(value)
          }
          // If value is a tag key, find the tag ID
          const tag = tags.find((t: any) => t?.key === value)
          return tag ? itemTagIds.includes(tag.id) : false
        case 'in':
          const values = Array.isArray(value) ? value : [value]
          return values.some((v) => {
            if (typeof v === 'string' && v.startsWith('tag_')) {
              return itemTagIds.includes(v)
            }
            const tag = tags.find((t: any) => t?.key === v)
            return tag ? itemTagIds.includes(tag.id) : false
          })
        case 'exists':
          return itemTagIds.length > 0
        default:
          return false
      }

    case 'price':
      const itemPrice = item.price
      switch (operator) {
        case 'range':
          // Handle both object format {min, max} and direct min/max values
          let min, max
          if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            min = value.min
            max = value.max
          } else {
            // Fallback for other formats
            min = value.min || 0
            max = value.max || Infinity
          }
          return itemPrice >= min && itemPrice <= max
        case 'equals':
          return itemPrice === value
        default:
          return false
      }

    case 'category':
      switch (operator) {
        case 'equals':
          return item.category === value
        case 'in':
          const categories = Array.isArray(value) ? value : [value]
          return categories.includes(item.category)
        default:
          return false
      }

    case 'isVisible':
      switch (operator) {
        case 'equals':
          return item.isVisible === value
        default:
          return false
      }

    case 'name':
      switch (operator) {
        case 'contains':
          return item.name.toLowerCase().includes(value.toLowerCase())
        case 'equals':
          return item.name.toLowerCase() === value.toLowerCase()
        default:
          return false
      }

    case 'description':
      switch (operator) {
        case 'contains':
          return item.description.toLowerCase().includes(value.toLowerCase())
        case 'equals':
          return item.description.toLowerCase() === value.toLowerCase()
        default:
          return false
      }

    default:
      return false
  }
}

function evaluatePredicate(item: MenuItem, predicate: FilterPredicate, tags: any[]): boolean {
  const { conditions, logic } = predicate

  if (conditions.length === 0) {
    return true // No conditions means match all
  }

  const results = conditions.map((condition) => evaluateCondition(item, condition, tags))

  if (logic === 'AND') {
    return results.every((result) => result)
  } else if (logic === 'OR') {
    return results.some((result) => result)
  }

  return false
}

export function useMenuFilters(items: MenuItem[]) {
  const { tags } = useTags()
  const { filters, activeFilter } = useFilters()

  const currentFilter = useMemo(
    () => filters.find((f) => f.key === activeFilter),
    [filters, activeFilter],
  )

  const filteredItems = useMemo(() => {
    if (!items) return []

    // If no filter is selected or filter is 'all', return all items
    if (!currentFilter || currentFilter.key === 'all') {
      return items
    }

    // Filter items based on the current filter's predicate
    const filtered = items.filter((item) => {
      return evaluatePredicate(item, currentFilter.predicate, tags)
    })

    return filtered
  }, [items, currentFilter, tags])

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
    currentFilter,
    filteredItems,
    filteredCategories,
  }
}
