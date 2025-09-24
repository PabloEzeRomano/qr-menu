'use client'

import Button from '@/components/Button'
import { useFilters } from '@/contexts/FiltersProvider'
import { useMenuFilters } from '@/hooks/useMenuFilters'
import { MenuItem } from '@/types'

interface FilterBarProps {
  items: MenuItem[]
}

export default function FilterBar({ items }: FilterBarProps) {
  const { filters, loading, activeFilter, setActiveFilter } = useFilters()

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mb-10 flex flex-wrap items-center justify-center gap-3">
        <div className="animate-pulse bg-white/20 rounded-lg h-10 w-24"></div>
        <div className="animate-pulse bg-white/20 rounded-lg h-10 w-24"></div>
        <div className="animate-pulse bg-white/20 rounded-lg h-10 w-24"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mb-10 flex flex-wrap items-center justify-center gap-3">
      {filters
        .filter((filter) => filter.isActive)
        .sort((a, b) => a.order - b.order)
        .map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            variant={filter.key === activeFilter ? 'tertiary' : 'secondary'}
            size="sm"
            className={`flex items-center gap-2 ${
              filter.color ? `hover:${filter.color} hover:text-white` : ''
            }`}
          >
            {filter.icon && <span className="text-sm">{filter.icon}</span>}
            {filter.label}
          </Button>
        ))}
    </div>
  )
}
