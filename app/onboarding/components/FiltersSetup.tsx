'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/contexts/OnboardingProvider'
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useFilterOperations } from '@/hooks/useFilterOperations'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Trash2 } from 'lucide-react'

const COMMON_FILTERS = [
  { key: 'vegetariano', label: 'Vegetariano' },
  { key: 'vegano', label: 'Vegano' },
  { key: 'sin-gluten', label: 'Sin Gluten' },
  { key: 'picante', label: 'Picante' },
  { key: 'sin-lactosa', label: 'Sin Lactosa' },
  { key: 'bajo-calorias', label: 'Bajo en Calorías' },
  { key: 'sin-azucar', label: 'Sin Azúcar' },
  { key: 'organico', label: 'Orgánico' },
]

export default function FiltersSetup() {
  const { data, updateData, nextStep, previousStep, skipStep, currentStep } = useOnboarding()
  const [filters, setFilters] = useState(data.filters)
  const [isLoading, setIsLoading] = useState(false)
  const { createTagFilter } = useFilterOperations()
  const { handleError } = useErrorHandler()

  // Sync filters when context data changes (e.g., when existing data is loaded)
  useEffect(() => {
    setFilters(data.filters)
  }, [data.filters])

  const handleAddFilter = () => {
    setFilters((prev) => [
      ...prev,
      {
        key: '',
        label: '',
        id: '',
        type: 'tag' as const,
        predicate: { conditions: [], logic: 'AND' as const },
        isActive: true,
        order: 0,
      },
    ])
  }

  const handleFilterChange = (index: number, field: string, value: string) => {
    setFilters((prev) =>
      prev.map((filter, i) => (i === index ? { ...filter, [field]: value } : filter)),
    )
  }

  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index))
  }

  const handleQuickAdd = (filter: (typeof COMMON_FILTERS)[0]) => {
    const exists = filters.some((f) => f.key === filter.key)
    if (!exists) {
      setFilters((prev) => [
        ...prev,
        {
          ...filter,
          id: '',
          type: 'tag' as const,
          predicate: { conditions: [], logic: 'AND' as const },
          isActive: true,
          order: 0,
        },
      ])
    }
  }

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const validateFilters = () => {
    for (const filter of filters) {
      if (!filter.label.trim()) {
        handleError('validation', 'Todos los filtros deben tener un nombre')
        return false
      }
      if (!filter.key.trim()) {
        handleError('validation', 'Todos los filtros deben tener una clave única')
        return false
      }
    }

    const keys = filters.map((filter) => filter.key)
    const uniqueKeys = new Set(keys)
    if (keys.length !== uniqueKeys.size) {
      handleError('validation', 'Las claves de los filtros deben ser únicas')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (filters.length === 0) {
      skipStep()
      return
    }

    if (!validateFilters()) return

    setIsLoading(true)
    try {
      // Create filters in Firebase
      for (const filter of filters) {
        await createTagFilter(filter.key, filter.label, filter.key)
      }

      updateData('filters', filters)
      nextStep()
    } catch (error) {
      handleError('Error al crear los filtros', 'creation')
      console.error('Error creating filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto text-gray-600">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Filtros del Menú</h2>
        <p className="text-lg text-gray-600">
          Los filtros ayudan a tus clientes a encontrar productos que se adapten a sus necesidades
        </p>
      </div>

      {/* Quick Add Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros Populares</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMMON_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleQuickAdd(filter)}
              disabled={filters.some((f) => f.key === filter.key)}
              className="p-3 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Filters */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">Tus Filtros</h3>
            <Button type="button" onClick={handleAddFilter} size="sm">
              + Agregar Filtro
            </Button>
          </div>

          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <Input
                  type="text"
                  value={filter.label}
                  onChange={(e) => {
                    handleFilterChange(index, 'label', e.target.value)
                    handleFilterChange(index, 'key', generateKey(e.target.value))
                  }}
                  placeholder="Nombre del filtro"
                  containerClassName="mb-0"
                />
              </div>

              <div className="flex-shrink-0">
                <Input
                  type="text"
                  value={filter.key}
                  onChange={(e) => handleFilterChange(index, 'key', e.target.value)}
                  placeholder="clave-unica"
                  containerClassName="mb-0 w-32"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveFilter(index)}
                className="flex-shrink-0 text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={previousStep} disabled={currentStep === 0} variant="ghost">
            ← Anterior
          </Button>

          <div className="space-x-3 flex items-center gap-2 flex-row">
            <Button type="button" onClick={skipStep} variant="secondary">
              Omitir
            </Button>
            <Button type="submit" disabled={isLoading} loading={isLoading}>
              Continuar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
