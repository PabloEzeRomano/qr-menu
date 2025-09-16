'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { MenuItem } from '@/types'

interface ItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
}

export default function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!item) return null

  const getCategoryLabel = (categoryKey: string) => {
    const categories = {
      entradas: 'Entradas',
      principales: 'Platos principales',
      bebidas: 'Bebidas',
    }
    return categories[categoryKey as keyof typeof categories] || categoryKey
  }

  const getDietLabel = (dietKey: string) => {
    const dietLabels = {
      vegetariano: 'Vegetariano',
      vegano: 'Vegano',
      'sin-gluten': 'Sin gluten',
    }
    return dietLabels[dietKey as keyof typeof dietLabels] || dietKey
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 flex items-center justify-center p-4"
          >
            <div
              ref={modalRef}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/20"
            >
              {/* Header with close button */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={onClose}
                  className="absolute z-10 top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Image */}
              <div className="px-6">
                <div className="relative rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  {/* Tags overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {item.tags.includes('nuevo') && (
                      <span className="text-xs font-black tracking-wide bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                        NUEVO
                      </span>
                    )}
                    {item.tags.includes('recomendado') && (
                      <span className="text-xs font-black tracking-wide bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full shadow-lg">
                        RECOMENDADO
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {/* Title and Price */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white leading-tight">{item.name}</h2>
                  <div className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    ${item.price.toLocaleString('es-AR')}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <span className="text-sm text-cyan-200">{getCategoryLabel(item.category)}</span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-cyan-100 leading-relaxed">{item.description}</p>
                </div>

                {/* Diet information */}
                {item.diet.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-cyan-100 mb-2">
                      Información dietética
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.diet.map((diet) => (
                        <span
                          key={diet}
                          className="text-xs bg-cyan-900/50 text-cyan-200 px-3 py-1 rounded-full border border-cyan-700/50"
                        >
                          {getDietLabel(diet)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ¡Perfecto!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
