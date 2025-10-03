'use client'

import { motion } from 'framer-motion'
import { Pencil, X } from 'lucide-react'

import { Button } from '@/components/ui'

interface EditModeToggleProps {
  isEditMode: boolean
  onToggle: () => void
}

export default function EditModeToggle({ isEditMode, onToggle }: EditModeToggleProps) {
  return (
    <motion.div
      className="fixed bottom-5 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <Button
        onClick={onToggle}
        variant={isEditMode ? 'danger' : 'primary'}
        size="lg"
        className="!p-4 !rounded-full shadow-2xl"
        title={isEditMode ? 'Salir del modo edición' : 'Editar menú'}
      >
        {isEditMode ? <X size={24} className="animate-pulse" /> : <Pencil size={24} />}
      </Button>
    </motion.div>
  )
}
