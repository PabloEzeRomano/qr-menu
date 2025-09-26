'use client'

import { useTagOperations } from '@/hooks/useTagOperations'
import { Tag } from '@/types'
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, Tag as TagIcon } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Input, Select, Button } from '@/components/ui'

const TAG_CATEGORIES = [
  { value: 'diet', label: 'Dieta', color: 'bg-green-100 text-green-800' },
  { value: 'feature', label: 'Característica', color: 'bg-blue-100 text-blue-800' },
  { value: 'custom', label: 'Personalizado', color: 'bg-purple-100 text-purple-800' },
] as const

const TAG_COLORS = [
  { value: 'bg-red-500', label: 'Rojo' },
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-yellow-500', label: 'Amarillo' },
  { value: 'bg-purple-500', label: 'Morado' },
  { value: 'bg-pink-500', label: 'Rosa' },
  { value: 'bg-indigo-500', label: 'Índigo' },
  { value: 'bg-orange-500', label: 'Naranja' },
] as const

export default function AdminTags() {
  const { loading, fetchTags, createTag, updateTag, deleteTag, reorderTags } = useTagOperations()
  const [tags, setTags] = useState<Tag[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newTag, setNewTag] = useState<Partial<Tag>>({
    key: '',
    label: '',
    color: 'bg-blue-500',
    category: 'custom',
    isActive: true,
    order: 0,
  })

  const loadTags = useCallback(async () => {
    try {
      const fetchedTags = await fetchTags()
      setTags(fetchedTags.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error loading tags:', error)
    }
  }, [fetchTags])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const handleCreateTag = async () => {
    if (!newTag.key || !newTag.label) return

    try {
      const createdTag = await createTag({
        key: newTag.key,
        label: newTag.label,
        color: newTag.color || 'bg-blue-500',
        category: newTag.category || 'custom',
        isActive: newTag.isActive ?? true,
        order: tags.length,
      })
      setTags([...tags, createdTag].sort((a, b) => a.order - b.order))
      setNewTag({
        key: '',
        label: '',
        color: 'bg-blue-500',
        category: 'custom',
        isActive: true,
        order: 0,
      })
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const handleUpdateTag = async (tagId: string, updates: Partial<Tag>) => {
    try {
      const updatedTag = await updateTag(tagId, updates)
      setTags(
        tags.map((tag) => (tag.id === tagId ? updatedTag : tag)).sort((a, b) => a.order - b.order),
      )
      setEditingTag(null)
    } catch (error) {
      console.error('Error updating tag:', error)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      try {
        await deleteTag(tagId)
        setTags(tags.filter((tag) => tag.id !== tagId))
      } catch (error) {
        console.error('Error deleting tag:', error)
      }
    }
  }

  const handleToggleActive = async (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId)
    if (tag) {
      await handleUpdateTag(tagId, { isActive: !tag.isActive })
    }
  }

  const handleDragStart = (e: React.DragEvent, tagId: string) => {
    e.dataTransfer.setData('text/plain', tagId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetTagId: string) => {
    e.preventDefault()
    const draggedTagId = e.dataTransfer.getData('text/plain')

    if (draggedTagId === targetTagId) return

    const draggedIndex = tags.findIndex((tag) => tag.id === draggedTagId)
    const targetIndex = tags.findIndex((tag) => tag.id === targetTagId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newTags = [...tags]
    const [draggedTag] = newTags.splice(draggedIndex, 1)
    newTags.splice(targetIndex, 0, draggedTag)

    // Update order values
    const reorderedTags = newTags.map((tag, index) => ({ ...tag, order: index }))
    setTags(reorderedTags)

    try {
      await reorderTags(reorderedTags.map((tag) => tag.id))
    } catch (error) {
      console.error('Error reordering tags:', error)
      // Revert on error
      loadTags()
    }
  }

  if (loading && tags.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Etiquetas</h2>
        <p className="text-gray-600">
          Administra las etiquetas disponibles para los items del menú
        </p>
      </div>

      {/* Create New Tag */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isCreating ? 'Crear Nueva Etiqueta' : 'Etiquetas'}
          </h3>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {isCreating ? 'Cancelar' : 'Nueva Etiqueta'}
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Clave (ID)"
                  type="text"
                  value={newTag.key || ''}
                  onChange={(e) => setNewTag({ ...newTag, key: e.target.value })}
                  placeholder="ej: picante, sin-lactosa"
                />
              </div>
              <div>
                <Input
                  label="Etiqueta"
                  type="text"
                  value={newTag.label || ''}
                  onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
                  placeholder="ej: Picante, Sin Lactosa"
                />
              </div>
              <div>
                <Select
                  label="Categoría"
                  value={newTag.category || 'custom'}
                  onChange={(e) =>
                    setNewTag({ ...newTag, category: e.target.value as Tag['category'] })
                  }
                  options={TAG_CATEGORIES.map((category) => ({
                    value: category.value,
                    label: category.label,
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewTag({ ...newTag, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        newTag.color === color.value ? 'ring-2 ring-gray-400' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleCreateTag}
                variant="primary"
                size="sm"
                disabled={!newTag.key || !newTag.label}
              >
                Crear Etiqueta
              </Button>
              <Button onClick={() => setIsCreating(false)} variant="secondary" size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tags List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Etiquetas ({tags.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tags.length === 0 ? (
            <div className="text-center py-8">
              <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay etiquetas configuradas</p>
            </div>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                draggable
                onDragStart={(e) => handleDragStart(e, tag.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, tag.id)}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{tag.label}</span>
                        <span className="text-sm text-gray-500">({tag.key})</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            TAG_CATEGORIES.find((c) => c.value === tag.category)?.color ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {TAG_CATEGORIES.find((c) => c.value === tag.category)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(tag.id)}
                      className={`p-2 rounded-md transition-colors ${
                        tag.isActive
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={tag.isActive ? 'Ocultar etiqueta' : 'Mostrar etiqueta'}
                    >
                      {tag.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                      title="Editar etiqueta"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Eliminar etiqueta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Etiqueta</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Clave (ID)"
                      type="text"
                      value={editingTag.key}
                      onChange={(e) => setEditingTag({ ...editingTag, key: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      label="Etiqueta"
                      type="text"
                      value={editingTag.label}
                      onChange={(e) => setEditingTag({ ...editingTag, label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Select
                      label="Categoría"
                      value={editingTag.category}
                      onChange={(e) =>
                        setEditingTag({
                          ...editingTag,
                          category: e.target.value as Tag['category'],
                        })
                      }
                      options={TAG_CATEGORIES.map((category) => ({
                        value: category.value,
                        label: category.label,
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setEditingTag({ ...editingTag, color: color.value })}
                          className={`w-8 h-8 rounded-full ${color.value} ${
                            editingTag.color === color.value ? 'ring-2 ring-gray-400' : ''
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button onClick={() => setEditingTag(null)} variant="secondary" size="sm">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleUpdateTag(editingTag.id, editingTag)}
                    variant="primary"
                    size="sm"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
