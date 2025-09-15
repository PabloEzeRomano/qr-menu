'use client';

import { motion } from 'framer-motion';
import { Check, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  diet: string[];
  img: string;
}

interface EditableMenuItemProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
  isEditMode: boolean;
  onUpdate: (updatedItem: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

export default function EditableMenuItem({
  item,
  onItemClick,
  isEditMode,
  onUpdate,
  onDelete
}: EditableMenuItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempItem, setTempItem] = useState({ ...item });

  const handleSave = () => {
    if (tempItem.name.trim() && tempItem.description.trim()) {
      onUpdate(tempItem);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempItem({ ...item });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      onDelete(item.id);
    }
  };

  const updateField = (field: keyof MenuItem, value: string[] | number | string) => {
    setTempItem(prev => ({ ...prev, [field]: value }));
  };

  const updateTags = (tag: string, add: boolean) => {
    const newTags = add
      ? [...tempItem.tags, tag]
      : tempItem.tags.filter(t => t !== tag);
    updateField('tags', newTags);
  };

  const updateDiet = (diet: string, add: boolean) => {
    const newDiet = add
      ? [...tempItem.diet, diet]
      : tempItem.diet.filter(d => d !== diet);
    updateField('diet', newDiet);
  };

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
              value={tempItem.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="Nombre del plato"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={tempItem.description}
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
              value={tempItem.price}
              onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="0"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {['nuevo', 'recomendado'].map(tag => (
                <button
                  key={tag}
                  onClick={() => updateTags(tag, !tempItem.tags.includes(tag))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    tempItem.tags.includes(tag)
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
              {['vegetariano', 'sin-gluten'].map(diet => (
                <button
                  key={diet}
                  onClick={() => updateDiet(diet, !tempItem.diet.includes(diet))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    tempItem.diet.includes(diet)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/20 text-emerald-200 hover:bg-white/30'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.article>
    );
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
      className="group relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg overflow-hidden cursor-pointer"
    >
      {/* Edit Button */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-cyan-500/80 hover:bg-cyan-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <Edit2 size={16} />
        </button>
      )}

      {/* Tags */}
      {item.tags.includes('nuevo') && (
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
      {item.tags.includes('recomendado') && (
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
            src={item.img}
            alt={item.name}
            width={160}
            height={160}
            className="h-40 w-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-bold text-white leading-tight">
          {item.name}
        </h4>
        <div className="font-black text-lg bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          ${item.price.toLocaleString('es-AR')}
        </div>
      </div>
    </motion.article>
  );
}
