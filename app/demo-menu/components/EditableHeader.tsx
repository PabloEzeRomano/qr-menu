'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'

interface EditableHeaderProps {
  title: string
  subtitle: string
  isEditMode: boolean
  onTitleChange: (newTitle: string) => void
  onSubtitleChange: (newSubtitle: string) => void
}

export default function EditableHeader({
  title,
  subtitle,
  isEditMode,
  onTitleChange,
  onSubtitleChange,
}: EditableHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(title)
  const [tempSubtitle, setTempSubtitle] = useState(subtitle)

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleSubtitleSave = () => {
    if (tempSubtitle.trim()) {
      onSubtitleChange(tempSubtitle.trim())
    }
    setIsEditingSubtitle(false)
  }

  const handleTitleCancel = () => {
    setTempTitle(title)
    setIsEditingTitle(false)
  }

  const handleSubtitleCancel = () => {
    setTempSubtitle(subtitle)
    setIsEditingSubtitle(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center my-10 relative flex flex-col items-center justify-center"
    >
      {/* Title */}
      <div className="relative inline-block">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 text-center min-w-[300px]"
              autoFocus
            />
            <button
              onClick={handleTitleSave}
              className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Check size={20} />
            </button>
            <button
              onClick={handleTitleCancel}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white filter drop-shadow-[0_0_20px_rgba(5,150,105,0.8)]">
            {title}
            {isEditMode && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="ml-3 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
              >
                <Edit2 size={20} />
              </button>
            )}
          </h1>
        )}
      </div>

      {/* Subtitle */}
      <div className="relative inline-block mt-3">
        {isEditingSubtitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              className="text-lg text-cyan-200 bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 text-center min-w-[250px] font-medium"
              autoFocus
            />
            <button
              onClick={handleSubtitleSave}
              className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleSubtitleCancel}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-lg mt-3 text-cyan-200 font-medium drop-shadow-lg underline">
            {subtitle}
            {isEditMode && (
              <button
                onClick={() => setIsEditingSubtitle(true)}
                className="ml-2 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
              >
                <Edit2 size={16} />
              </button>
            )}
          </p>
        )}
      </div>
    </motion.div>
  )
}
