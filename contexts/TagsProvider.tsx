'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Tag } from '@/types'
import { listTags } from '@/lib/api/filters'

interface TagsContextType {
  tags: Tag[]
  loading: boolean
  error: string | null
  refreshTags: () => Promise<void>
  getTagById: (id: string) => Tag | undefined
  getTagsByCategory: (category: Tag['category']) => Tag[]
  getActiveTags: () => Tag[]
}

const TagsContext = createContext<TagsContextType | null>(null)

interface TagsProviderProps {
  children: ReactNode
}

export function TagsProvider({ children }: TagsProviderProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTags = await listTags()
      setTags(fetchedTags.sort((a, b) => a.order - b.order))
    } catch (err) {
      console.error('Error fetching tags:', err)
      setError(err instanceof Error ? err.message : 'Error loading tags')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const refreshTags = async () => {
    await fetchTags()
  }

  const getTagById = (id: string): Tag | undefined => {
    return tags.find((tag) => tag.id === id)
  }

  const getTagsByCategory = (category: Tag['category']): Tag[] => {
    return tags.filter((tag) => tag.category === category && tag.isActive)
  }

  const getActiveTags = (): Tag[] => {
    return tags.filter((tag) => tag.isActive)
  }

  return (
    <TagsContext.Provider
      value={{
        tags,
        loading,
        error,
        refreshTags,
        getTagById,
        getTagsByCategory,
        getActiveTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  )
}

export function useTags() {
  const context = useContext(TagsContext)
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider')
  }
  return context
}
