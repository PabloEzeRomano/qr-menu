'use client'

import { useFilterOperations } from '@/hooks/useFilterOperations'
import { useTags } from '@/contexts/TagsProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { Filter, FilterType } from '@/types'
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Filter as FilterIcon,
  Tag,
  DollarSign,
  Folder,
  Clock,
  Settings,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '@/components/Button'

const FILTER_TYPES = [
  { value: 'tag', label: 'Por Etiqueta', icon: Tag, color: 'bg-blue-100 text-blue-800' },
  {
    value: 'price_range',
    label: 'Por Precio',
    icon: DollarSign,
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'category',
    label: 'Por Categoría',
    icon: Folder,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'availability',
    label: 'Por Disponibilidad',
    icon: Clock,
    color: 'bg-orange-100 text-orange-800',
  },
  { value: 'custom', label: 'Personalizado', icon: Settings, color: 'bg-gray-100 text-gray-800' },
] as const

const FILTER_COLORS = [
  { value: 'bg-red-500', label: 'Rojo' },
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-yellow-500', label: 'Amarillo' },
  { value: 'bg-purple-500', label: 'Morado' },
  { value: 'bg-pink-500', label: 'Rosa' },
  { value: 'bg-indigo-500', label: 'Índigo' },
  { value: 'bg-orange-500', label: 'Naranja' },
] as const

export default function AdminFilters() {
  const {
    loading,
    fetchFilters,
    createFilter,
    updateFilter,
    deleteFilter,
    reorderFilters,
    createTagFilter,
    createPriceRangeFilter,
    createCategoryFilter,
  } = useFilterOperations()
  const { tags } = useTags()
  const { categories } = useMenuData()
  const [filters, setFilters] = useState<Filter[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null)
  const [newFilter, setNewFilter] = useState<Partial<Filter>>({
    key: '',
    label: '',
    description: '',
    type: 'tag',
    isActive: true,
    order: 0,
    predicate: {
      conditions: [],
      logic: 'AND',
    },
  })

  useEffect(() => {
    loadFilters()
  }, [])

  const loadFilters = async () => {
    try {
      const fetchedFilters = await fetchFilters()
      setFilters(fetchedFilters.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  const handleCreateFilter = async () => {
    if (!newFilter.key || !newFilter.label) return

    // For custom type filters (like "all"), allow empty conditions
    // For other types, ensure at least one condition exists
    if (newFilter.type !== 'custom' && (!newFilter.predicate || newFilter.predicate.conditions.length === 0)) {
      console.error('Filter must have at least one condition')
      return
    }

    try {
      const createdFilter = await createFilter({
        key: newFilter.key,
        label: newFilter.label,
        description: newFilter.description || '',
        icon: newFilter.icon,
        type: newFilter.type as FilterType,
        predicate: newFilter.predicate || { conditions: [], logic: 'AND' },
        isActive: newFilter.isActive ?? true,
        order: filters.length,
        color: newFilter.color,
      })
      setFilters([...filters, createdFilter].sort((a, b) => a.order - b.order))
      setNewFilter({
        key: '',
        label: '',
        description: '',
        type: 'tag',
        isActive: true,
        order: 0,
        predicate: {
          conditions: [{ field: '', operator: 'equals', value: '' }],
          logic: 'AND',
        },
      })
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating filter:', error)
    }
  }

  const handleUpdateFilter = async (filterId: string, updates: Partial<Filter>) => {
    try {
      const updatedFilter = await updateFilter(filterId, updates)
      setFilters(
        filters
          .map((filter) => (filter.id === filterId ? updatedFilter : filter))
          .sort((a, b) => a.order - b.order),
      )
      setEditingFilter(null)
    } catch (error) {
      console.error('Error updating filter:', error)
    }
  }

  const handleDeleteFilter = async (filterId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este filtro?')) {
      try {
        await deleteFilter(filterId)
        setFilters(filters.filter((filter) => filter.id !== filterId))
      } catch (error) {
        console.error('Error deleting filter:', error)
      }
    }
  }

  const handleToggleActive = async (filterId: string) => {
    const filter = filters.find((f) => f.id === filterId)
    if (filter) {
      await handleUpdateFilter(filterId, { isActive: !filter.isActive })
    }
  }

  const handleDragStart = (e: React.DragEvent, filterId: string) => {
    e.dataTransfer.setData('text/plain', filterId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetFilterId: string) => {
    e.preventDefault()
    const draggedFilterId = e.dataTransfer.getData('text/plain')

    if (draggedFilterId === targetFilterId) return

    const draggedIndex = filters.findIndex((filter) => filter.id === draggedFilterId)
    const targetIndex = filters.findIndex((filter) => filter.id === targetFilterId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newFilters = [...filters]
    const [draggedFilter] = newFilters.splice(draggedIndex, 1)
    newFilters.splice(targetIndex, 0, draggedFilter)

    // Update order values
    const reorderedFilters = newFilters.map((filter, index) => ({ ...filter, order: index }))
    setFilters(reorderedFilters)

    try {
      await reorderFilters(reorderedFilters.map((filter) => filter.id))
    } catch (error) {
      console.error('Error reordering filters:', error)
      // Revert on error
      loadFilters()
    }
  }

  const getFilterTypeInfo = (type: FilterType) => {
    return FILTER_TYPES.find((t) => t.value === type) || FILTER_TYPES[0]
  }

  if (loading && filters.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Filtros</h2>
        <p className="text-gray-600">Administra los filtros disponibles para el menú</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => {
              // Create common tag filters
              const commonTags = tags.filter((tag) =>
                ['nuevo', 'recomendado', 'vegetariano', 'sin-gluten'].includes(tag.key),
              )
              commonTags.forEach((tag) => {
                createTagFilter(tag.key, tag.label, tag.key, '🏷️', tag.color)
              })
              loadFilters()
            }}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Tag size={16} />
            Crear Filtros de Etiquetas
          </Button>
          <Button
            onClick={() => {
              // Create price range filters
              createPriceRangeFilter('economico', 'Económico', 0, 1000, '💰', 'bg-green-500')
              createPriceRangeFilter('medio', 'Precio Medio', 1000, 2500, '💵', 'bg-yellow-500')
              createPriceRangeFilter('premium', 'Premium', 2500, 5000, '💎', 'bg-purple-500')
              loadFilters()
            }}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <DollarSign size={16} />
            Crear Filtros de Precio
          </Button>
          <Button
            onClick={() => {
              // Create category filters
              categories.forEach((category) => {
                createCategoryFilter(
                  category.key,
                  category.label,
                  category.key,
                  category.icon,
                  'bg-blue-500',
                )
              })
              loadFilters()
            }}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Folder size={16} />
            Crear Filtros de Categoría
          </Button>
        </div>
      </div>

      {/* Create New Filter */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isCreating ? 'Crear Nuevo Filtro' : 'Filtros'}
          </h3>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {isCreating ? 'Cancelar' : 'Nuevo Filtro'}
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clave (ID)</label>
                <input
                  type="text"
                  value={newFilter.key || ''}
                  onChange={(e) => setNewFilter({ ...newFilter, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ej: vegetariano, economico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={newFilter.label || ''}
                  onChange={(e) => setNewFilter({ ...newFilter, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ej: Vegetariano, Económico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Filtro
                </label>
                <select
                  value={newFilter.type || 'tag'}
                  onChange={(e) =>
                    setNewFilter({ ...newFilter, type: e.target.value as FilterType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {FILTER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {FILTER_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewFilter({ ...newFilter, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        newFilter.color === color.value ? 'ring-2 ring-gray-400' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleCreateFilter}
                variant="primary"
                size="sm"
                disabled={
                  !newFilter.key ||
                  !newFilter.label ||
                  (newFilter.type !== 'custom' && (!newFilter.predicate || newFilter.predicate.conditions.length === 0))
                }
              >
                Crear Filtro
              </Button>
              <Button onClick={() => setIsCreating(false)} variant="secondary" size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filters List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Filtros ({filters.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filters.length === 0 ? (
            <div className="text-center py-8">
              <FilterIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay filtros configurados</p>
            </div>
          ) : (
            filters.map((filter) => {
              const typeInfo = getFilterTypeInfo(filter.type)
              const Icon = typeInfo.icon

              return (
                <div
                  key={filter.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, filter.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, filter.id)}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <div className={`w-4 h-4 rounded-full ${filter.color || 'bg-gray-500'}`} />
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{filter.label}</span>
                          <span className="text-sm text-gray-500">({filter.key})</span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}
                          >
                            {typeInfo.label}
                          </span>
                        </div>
                        {filter.description && (
                          <div className="text-sm text-gray-500 mt-1">{filter.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(filter.id)}
                        className={`p-2 rounded-md transition-colors ${
                          filter.isActive
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={filter.isActive ? 'Ocultar filtro' : 'Mostrar filtro'}
                      >
                        {filter.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingFilter(filter)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                        title="Editar filtro"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFilter(filter.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Eliminar filtro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
