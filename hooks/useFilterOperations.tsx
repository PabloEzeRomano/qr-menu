'use client'

import { useCallback, useState } from 'react'
import { useErrorHandler } from './useErrorHandler'
import { Filter, FilterCondition, FilterPredicate } from '@/types'
import { listFilters, createFilters, updateFilters } from '@/lib/api/filters'

export function useFilterOperations() {
  const { handleError } = useErrorHandler()
  const [loading, setLoading] = useState(false)

  const fetchFilters = useCallback(async () => {
    try {
      setLoading(true)
      const filters = await listFilters()
      return filters
    } catch (error) {
      handleError(error, 'Error al cargar los filtros')
      throw error
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createFilter = useCallback(
    async (filterData: Omit<Filter, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(true)
        const existingFilters = await listFilters()
        const newFilter: Filter = {
          ...filterData,
          id: `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const updatedFilters = [...existingFilters, newFilter]
        await createFilters({ filters: updatedFilters })
        return newFilter
      } catch (error) {
        handleError(error, 'Error al crear el filtro')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const updateFilter = useCallback(
    async (filterId: string, updates: Partial<Omit<Filter, 'id' | 'createdAt' | 'updatedAt'>>) => {
      try {
        setLoading(true)
        const existingFilters = await listFilters()
        const updatedFilters = existingFilters.map((filter) =>
          filter.id === filterId ? { ...filter, ...updates, updatedAt: new Date() } : filter,
        )
        await updateFilters({ filters: updatedFilters })
        return updatedFilters.find((filter) => filter.id === filterId)!
      } catch (error) {
        handleError(error, 'Error al actualizar el filtro')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const deleteFilter = useCallback(
    async (filterId: string) => {
      try {
        setLoading(true)
        const existingFilters = await listFilters()
        const updatedFilters = existingFilters.filter((filter) => filter.id !== filterId)
        await updateFilters({ filters: updatedFilters })
      } catch (error) {
        handleError(error, 'Error al eliminar el filtro')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const reorderFilters = useCallback(
    async (filterIds: string[]) => {
      try {
        setLoading(true)
        const existingFilters = await listFilters()
        const reorderedFilters = filterIds
          .map((id, index) => {
            const filter = existingFilters.find((f) => f.id === id)
            return filter ? { ...filter, order: index, updatedAt: new Date() } : null
          })
          .filter(Boolean) as Filter[]

        // Add any remaining filters that weren't in the reorder list
        const remainingFilters = existingFilters.filter((filter) => !filterIds.includes(filter.id))
        const finalFilters = [...reorderedFilters, ...remainingFilters]

        await updateFilters({ filters: finalFilters })
      } catch (error) {
        handleError(error, 'Error al reordenar los filtros')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  // Helper functions for creating common filter types
  const createTagFilter = useCallback(
    (key: string, label: string, tagKey: string, icon?: string) => {
      const predicate: FilterPredicate = {
        conditions: [
          {
            field: 'tagIds',
            operator: 'contains',
            value: tagKey, // This will be resolved to tag ID in the filter logic
          },
        ],
        logic: 'AND',
      }

      return createFilter({
        key,
        label,
        description: `Filtrar por etiqueta: ${label}`,
        icon,
        type: 'tag',
        predicate,
        isActive: true,
        order: 0,
      })
    },
    [createFilter],
  )

  const createPriceRangeFilter = useCallback(
    (key: string, label: string, minPrice: number, maxPrice: number, icon?: string) => {
      const predicate: FilterPredicate = {
        conditions: [
          {
            field: 'price',
            operator: 'range',
            value: { min: minPrice, max: maxPrice },
          },
        ],
        logic: 'AND',
      }

      return createFilter({
        key,
        label,
        description: `Filtrar por rango de precio: $${minPrice} - $${maxPrice}`,
        icon,
        type: 'price_range',
        predicate,
        isActive: true,
        order: 0,
      })
    },
    [createFilter],
  )

  const createCategoryFilter = useCallback(
    (key: string, label: string, categoryKey: string, icon?: string) => {
      const predicate: FilterPredicate = {
        conditions: [
          {
            field: 'category',
            operator: 'equals',
            value: categoryKey,
          },
        ],
        logic: 'AND',
      }

      return createFilter({
        key,
        label,
        description: `Filtrar por categoría: ${label}`,
        icon,
        type: 'category',
        predicate,
        isActive: true,
        order: 0,
      })
    },
    [createFilter],
  )

  return {
    loading,
    fetchFilters,
    createFilter,
    updateFilter,
    deleteFilter,
    reorderFilters,
    createTagFilter,
    createPriceRangeFilter,
    createCategoryFilter,
  }
}
