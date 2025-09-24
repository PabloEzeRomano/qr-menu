'use client'

import { useTags } from '@/contexts/TagsProvider'
import { Tag } from '@/types'
import { motion } from 'framer-motion'

interface TagDisplayProps {
  tagIds: string[]
  className?: string
  showLabels?: boolean
  maxTags?: number
}

export default function TagDisplay({
  tagIds,
  className = '',
  showLabels = true,
  maxTags,
}: TagDisplayProps) {
  const { getTagById, getActiveTags } = useTags()

  // Get active tags that match the provided IDs
  const activeTags = getActiveTags()
  const displayTags = tagIds
    .map((id) => getTagById(id))
    .filter((tag): tag is Tag => tag !== undefined && tag.isActive)
    .slice(0, maxTags)

  if (displayTags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayTags.map((tag, index) => (
        <motion.span
          key={tag.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold shadow-lg ${tag.color} text-white`}
        >
          {showLabels && tag.label}
        </motion.span>
      ))}
      {maxTags && tagIds.length > maxTags && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: displayTags.length * 0.1 }}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-500/90 text-white shadow-lg"
        >
          +{tagIds.length - maxTags}
        </motion.span>
      )}
    </div>
  )
}
