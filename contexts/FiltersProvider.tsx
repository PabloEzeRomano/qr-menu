'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Filter } from '@/types'
import { useFilterOperations } from '@/hooks/useFilterOperations'

interface FiltersContextType {
  filters: Filter[]
  loading: boolean
  error: string | null
  activeFilter: string
  setActiveFilter: (filter: string) => void
  refreshFilters: () => Promise<void>
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const { fetchFilters } = useFilterOperations()

  const refreshFilters = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedFilters = await fetchFilters()
      setFilters(fetchedFilters)
    } catch (err) {
      console.error('Error fetching filters:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch filters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshFilters()
  }, [])

  return (
    <FiltersContext.Provider
      value={{
        filters,
        loading,
        error,
        activeFilter,
        setActiveFilter,
        refreshFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }
  return context
}
