'use client'

import { useCallback, useState } from 'react'

import { createTags, listTags, updateTags } from '@/lib/api/filters'
import { Tag } from '@/types'

import { useErrorHandler } from './useErrorHandler'

export function useTagOperations() {
  const { handleError } = useErrorHandler()
  const [loading, setLoading] = useState(false)

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true)
      const tags = await listTags()
      return tags
    } catch (error) {
      handleError(error, 'Error al cargar las etiquetas')
      throw error
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createTag = useCallback(
    async (tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(true)
        const existingTags = await listTags()
        const newTag: Tag = {
          ...tagData,
          id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const updatedTags = [...existingTags, newTag]
        await createTags({ tags: updatedTags })
        return newTag
      } catch (error) {
        handleError(error, 'Error al crear la etiqueta')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const updateTag = useCallback(
    async (tagId: string, updates: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>) => {
      try {
        setLoading(true)
        const existingTags = await listTags()
        const updatedTags = existingTags.map((tag) =>
          tag.id === tagId ? { ...tag, ...updates, updatedAt: new Date() } : tag,
        )
        await updateTags({ tags: updatedTags })
        return updatedTags.find((tag) => tag.id === tagId)!
      } catch (error) {
        handleError(error, 'Error al actualizar la etiqueta')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const deleteTag = useCallback(
    async (tagId: string) => {
      try {
        setLoading(true)
        const existingTags = await listTags()
        const updatedTags = existingTags.filter((tag) => tag.id !== tagId)
        await updateTags({ tags: updatedTags })
      } catch (error) {
        handleError(error, 'Error al eliminar la etiqueta')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  const reorderTags = useCallback(
    async (tagIds: string[]) => {
      try {
        setLoading(true)
        const existingTags = await listTags()
        const reorderedTags = tagIds
          .map((id, index) => {
            const tag = existingTags.find((t) => t.id === id)
            return tag ? { ...tag, order: index, updatedAt: new Date() } : null
          })
          .filter(Boolean) as Tag[]

        // Add any remaining tags that weren't in the reorder list
        const remainingTags = existingTags.filter((tag) => !tagIds.includes(tag.id))
        const finalTags = [...reorderedTags, ...remainingTags]

        await updateTags({ tags: finalTags })
      } catch (error) {
        handleError(error, 'Error al reordenar las etiquetas')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [handleError],
  )

  return {
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    reorderTags,
  }
}
