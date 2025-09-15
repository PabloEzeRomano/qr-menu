'use client';

import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddCategoryButtonProps {
  isEditMode: boolean;
  onAddCategory: (category: { key: string; label: string; icon: string }) => void;
}

export default function AddCategoryButton({ isEditMode, onAddCategory }: AddCategoryButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [tempCategory, setTempCategory] = useState({ key: '', label: '', icon: '🍽️' });

  const handleAdd = () => {
    if (tempCategory.key.trim() && tempCategory.label.trim()) {
      onAddCategory({
        key: tempCategory.key.trim(),
        label: tempCategory.label.trim(),
        icon: tempCategory.icon.trim() || '🍽️'
      });
      setTempCategory({ key: '', label: '', icon: '🍽️' });
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTempCategory({ key: '', label: '', icon: '🍽️' });
    setIsAdding(false);
  };

  if (!isEditMode) return null;

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-dashed border-cyan-400/50"
      >
        <h3 className="text-xl font-bold text-white mb-4">Agregar nueva categoría</h3>

        <div className="space-y-4">
          {/* Icon */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Icono</label>
            <input
              type="text"
              value={tempCategory.icon}
              onChange={(e) => setTempCategory(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 text-center text-2xl"
              placeholder="🍽️"
            />
          </div>

          {/* Key */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Clave (sin espacios)</label>
            <input
              type="text"
              value={tempCategory.key}
              onChange={(e) => setTempCategory(prev => ({ ...prev, key: e.target.value.replace(/\s+/g, '-').toLowerCase() }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="nueva-categoria"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-cyan-200 text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={tempCategory.label}
              onChange={(e) => setTempCategory(prev => ({ ...prev, label: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
              placeholder="Nueva Categoría"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAdd}
              disabled={!tempCategory.key.trim() || !tempCategory.label.trim()}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Agregar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={() => setIsAdding(true)}
      className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-dashed border-white/30 text-white hover:bg-white/20 transition-colors flex flex-col items-center gap-3"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Plus size={32} className="text-cyan-400" />
      <span className="text-lg font-medium">Agregar nueva categoría</span>
    </motion.button>
  );
}
