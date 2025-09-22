'use client'

import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContextProvider'
import { useCart } from '@/contexts/CartProvider'
import { useImageOperations } from '@/hooks/useImageOperations'
import { useItemOperations } from '@/hooks/useItemOperations'
import { TEMP_ID_PREFIX } from '@/lib/constants'
import { MenuItem } from '@/types'
import { motion } from 'framer-motion'
import { Check, Edit2, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface EditableMenuItemProps {
  item: MenuItem
  onItemClick: (item: MenuItem) => void
  isEditMode: boolean
  isCartEnabled: boolean
  isNewItem?: boolean
}

export default function EditableMenuItem({
  item,
  onItemClick,
  isEditMode,
  isCartEnabled,
  isNewItem = false,
}: EditableMenuItemProps) {
  const isNewItemCalculated = isNewItem || item.id.startsWith(TEMP_ID_PREFIX)
  const [isEditing, setIsEditing] = useState(isNewItemCalculated) // New items start in edit mode
  const [tempItem, setTempItem] = useState({ ...item })
  const [imageUploading, setImageUploading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [addedToCart, setAddedToCart] = useState(false)
  const { add } = useCart()
  const { isAdmin } = useAuth()
  // Component gets its own operations
  const { handleItemUpdate, handleItemDelete, handleSaveNewItem } = useItemOperations()
  const { handleImageUpload: uploadImage } = useImageOperations()

  // Use item data directly when not editing, tempItem when editing
  const displayItem = isEditing ? tempItem : item

  const handleSave = async () => {
    if (tempItem.name.trim() && tempItem.description.trim()) {
      if (isNewItemCalculated) {
        await handleSaveNewItem(tempItem)
      } else {
        await handleItemUpdate(tempItem)
      }
      setSelectedFileName('')
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTempItem({ ...item })
    setSelectedFileName('')
    setIsEditing(false)
  }

  // Only update tempItem when item prop changes AND we're not currently editing
  // This prevents overriding user's changes while they're actively editing
  useEffect(() => {
    if (!isEditing) {
      setTempItem({ ...item })
    }
  }, [item, isEditing])

  // When starting to edit, ensure tempItem is up to date with current item
  const startEditing = () => {
    setTempItem({ ...item })
    setIsEditing(true)
  }

  useEffect(() => {
    isEditing && !isEditMode && setIsEditing(false)
  }, [isEditing, isEditMode])

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      await handleItemDelete(item.id)
    }
  }

  const updateField = (field: keyof MenuItem, value: string[] | number | string | boolean) => {
    setTempItem((prev) => ({ ...prev, [field]: value }))
  }

  const updateTags = (tag: string, add: boolean) => {
    const newTags = add ? [...tempItem.tags, tag] : tempItem.tags.filter((t) => t !== tag)
    updateField('tags', newTags)
  }

  const updateDiet = (diet: string, add: boolean) => {
    const newDiet = add ? [...tempItem.diet, diet] : tempItem.diet.filter((d) => d !== diet)
    updateField('diet', newDiet)
  }

  const handleImageUpload = async (file: File) => {
    setImageUploading(true)
    if (!file || file.size === 0) return

    setSelectedFileName(file.name)

    try {
      const url = await uploadImage(file, item.id)
      updateField('img', url)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setSelectedFileName('')
    } finally {
      setImageUploading(false)
    }
  }

  if (isEditing) {
    return (
      <motion.article
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative bg-white/20 backdrop-blur-sm border border-cyan-400/50 rounded-2xl p-4 shadow-lg overflow-hidden"
      >
        {/* Edit Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={displayItem.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="Nombre del plato"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={displayItem.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 resize-none"
              rows={3}
              placeholder="Descripción del plato"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              value={displayItem.price}
              onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="0"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {['nuevo', 'recomendado'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => updateTags(tag, !displayItem.tags.includes(tag))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    displayItem.tags.includes(tag)
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/20 text-cyan-200 hover:bg-white/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Diet */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-2">Dieta</label>
            <div className="flex flex-wrap gap-2">
              {['vegetariano', 'sin-gluten'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => updateDiet(diet, !displayItem.diet.includes(diet))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    displayItem.diet.includes(diet)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/20 text-emerald-200 hover:bg-white/30'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-2">Visibilidad</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <button
                  onClick={() => updateField('isVisible', !displayItem.isVisible)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
                    displayItem.isVisible ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      displayItem.isVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`ml-3 text-sm font-medium ${
                    displayItem.isVisible ? 'text-green-300' : 'text-gray-400'
                  }`}
                >
                  {displayItem.isVisible ? 'Visible en el menú' : 'Oculto del menú'}
                </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-2">Imagen</label>
            <div className="space-y-2">
              <div className="relative group/upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  id={`image-upload-${item.id}`}
                  disabled={imageUploading}
                />
                <div
                  className={`flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-gray-600/50 backdrop-blur-sm text-gray-300 rounded-lg transition-all duration-200 cursor-pointer ${
                    imageUploading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'group-hover/upload:bg-black/40 group-hover/upload:border-gray-500/70 group-hover/upload:text-white'
                  }`}
                >
                  {imageUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400 mr-2"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 group-hover/upload:scale-110 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Subir imagen
                    </>
                  )}
                </div>
              </div>

              {/* Display selected file name */}
              {selectedFileName && !imageUploading && (
                <div className="flex items-center text-sm text-gray-400 bg-black/20 rounded-lg px-3 py-2">
                  <svg
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="truncate">{selectedFileName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              variant="primary"
              size="md"
              disabled={imageUploading}
            >
              <Check size={16} />
              Guardar
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              size="sm"
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </motion.article>
    )
  }

  // Normal display mode
  return (
    <motion.article
      onClick={() => onItemClick(item)}
      whileHover={{
        y: -4,
        rotate: -0.25,
        boxShadow: '0 20px 40px rgba(0,0,0,.15)',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
      }}
      className={`group relative backdrop-blur-sm border rounded-2xl p-4 shadow-lg overflow-hidden cursor-pointer ${
        displayItem.isVisible
          ? 'bg-white/20 border-white/30'
          : 'bg-red-500/10 border-red-500/30 opacity-60'
      }`}
    >
      {/* Edit Button */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            startEditing()
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-cyan-500/80 hover:bg-cyan-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <Edit2 size={16} />
        </button>
      )}

      {/* Hidden indicator */}
      {!displayItem.isVisible && (
        <div className="absolute bottom-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
          OCULTO
        </div>
      )}

      {/* Tags */}
      {displayItem.tags.includes('nuevo') && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.2,
          }}
          className="absolute top-3 left-3 text-[10px] font-black tracking-wide bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full shadow-lg z-10"
        >
          NUEVO
        </motion.span>
      )}
      {displayItem.tags.includes('recomendado') && (
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.6,
          }}
          className="absolute top-3 right-3 text-[10px] font-black tracking-wide bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full shadow-lg z-10"
        >
          RECOMENDADO
        </motion.span>
      )}

      {/* Image */}
      <div className="relative mb-3">
        <div>
          <Image
            src={displayItem.img}
            alt={displayItem.name}
            width={160}
            height={160}
            className="h-40 w-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-white leading-tight">{displayItem.name}</h4>
          <div className="font-black text-lg bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            ${displayItem.price.toLocaleString('es-AR')}
          </div>
        </div>

        {/* Add to cart button - only show when not in edit mode, not admin, and cart is enabled */}
        {!isEditMode && !isAdmin && isCartEnabled && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              add({
                id: displayItem.id,
                name: displayItem.name,
                price: displayItem.price,
                img: displayItem.img,
                qty: 1,
              })
              setAddedToCart(true)
              setTimeout(() => setAddedToCart(false), 1000)
            }}
            variant={addedToCart ? 'success' : 'primary'}
            size="sm"
            className="flex-shrink-0"
          >
            <Plus size={16} />
          </Button>
        )}
      </div>
    </motion.article>
  )
}
