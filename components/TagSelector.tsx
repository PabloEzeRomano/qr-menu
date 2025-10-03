'use client'

import { useState } from 'react'

import { useTags } from '@/contexts/TagsProvider'
import { Tag } from '@/types'

interface TagSelectorProps {
  selectedTagIds: string[]
  onTagChange: (tagIds: string[]) => void
  categories?: Tag['category'][]
  className?: string
  maxSelections?: number
}

export default function TagSelector({
  selectedTagIds,
  onTagChange,
  categories = ['feature', 'diet', 'custom'],
  className = '',
  maxSelections,
}: TagSelectorProps) {
  const { getActiveTags, getTagsByCategory } = useTags()
  const [searchTerm, setSearchTerm] = useState('')

  const allActiveTags = getActiveTags()
  const filteredTags = allActiveTags.filter((tag) => {
    const matchesCategory = categories.includes(tag.category)
    const matchesSearch =
      tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.key.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      if (maxSelections && selectedTagIds.length >= maxSelections) {
        return // Don't add if max selections reached
      }
      onTagChange([...selectedTagIds, tagId])
    }
  }

  const isTagSelected = (tagId: string) => selectedTagIds.includes(tagId)

  const canSelectMore = !maxSelections || selectedTagIds.length < maxSelections

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Buscar etiquetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 text-sm"
        />
      </div>

      {/* Tags by Category */}
      {categories.map((category) => {
        const categoryTags = getTagsByCategory(category)
        const filteredCategoryTags = categoryTags.filter((tag) => {
          const matchesSearch =
            tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.key.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesSearch
        })

        if (filteredCategoryTags.length === 0) return null

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-cyan-200 capitalize">
              {category === 'diet'
                ? 'Dieta'
                : category === 'feature'
                  ? 'Características'
                  : 'Personalizado'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredCategoryTags.map((tag) => {
                const isSelected = isTagSelected(tag.id)
                const canSelect = canSelectMore || isSelected

                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    disabled={!canSelect}
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all
                      ${
                        isSelected
                          ? `${tag.color} text-white ring-2 ring-offset-1 ring-cyan-400`
                          : 'bg-white/20 text-cyan-200 hover:bg-white/30'
                      }
                      ${!canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {tag.label}
                    {isSelected && <span className="ml-1 text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Selection Summary */}
      {selectedTagIds.length > 0 && (
        <div className="pt-2 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cyan-200">
              {selectedTagIds.length} etiqueta{selectedTagIds.length !== 1 ? 's' : ''} seleccionada
              {selectedTagIds.length !== 1 ? 's' : ''}
            </span>
            {maxSelections && (
              <span className="text-xs text-cyan-300">
                {selectedTagIds.length}/{maxSelections}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
