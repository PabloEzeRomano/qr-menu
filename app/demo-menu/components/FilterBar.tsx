'use client'

import Button from '@/components/Button'

interface Filter {
  key: string
  label: string
}

interface FilterBarProps {
  filters: Filter[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterBar({ filters, activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="max-w-5xl mx-auto mb-10 flex flex-wrap items-center justify-center gap-3">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          variant={filter.key === activeFilter ? 'tertiary' : 'secondary'}
          size="sm"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
