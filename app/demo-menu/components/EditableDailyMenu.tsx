'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Edit2, Check, X, Plus, Trash2 } from 'lucide-react';

interface EditableDailyMenuProps {
  title: string;
  hours: string;
  price: number;
  items: string[];
  isEditMode: boolean;
  onTitleChange: (newTitle: string) => void;
  onHoursChange: (newHours: string) => void;
  onPriceChange: (newPrice: number) => void;
  onItemsChange: (newItems: string[]) => void;
}

export default function EditableDailyMenu({
  title,
  hours,
  price,
  items,
  isEditMode,
  onTitleChange,
  onHoursChange,
  onPriceChange,
  onItemsChange
}: EditableDailyMenuProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempHours, setTempHours] = useState(hours);
  const [tempPrice, setTempPrice] = useState(price.toString());
  const [tempItems, setTempItems] = useState([...items]);

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleHoursSave = () => {
    if (tempHours.trim()) {
      onHoursChange(tempHours.trim());
    }
    setIsEditingHours(false);
  };

  const handlePriceSave = () => {
    const numPrice = parseInt(tempPrice);
    if (!isNaN(numPrice) && numPrice > 0) {
      onPriceChange(numPrice);
    }
    setIsEditingPrice(false);
  };

  const handleItemsSave = () => {
    const validItems = tempItems.filter(item => item.trim());
    if (validItems.length > 0) {
      onItemsChange(validItems);
    }
  };

  const addItem = () => {
    setTempItems([...tempItems, '']);
  };

  const removeItem = (index: number) => {
    const newItems = tempItems.filter((_, i) => i !== index);
    setTempItems(newItems);
    onItemsChange(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...tempItems];
    newItems[index] = value;
    setTempItems(newItems);
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative max-w-4xl mx-auto mb-12"
    >
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-fuchsia-500/30 to-blue-500/30 blur-xl" />
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✨</span>
          <div className="relative">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="text-2xl md:text-3xl font-extrabold text-white bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setTempTitle(title);
                    setIsEditingTitle(false);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                {title}
                {isEditMode && (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="ml-2 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hours and Description */}
        <div className="mb-5">
          {isEditingHours ? (
            <div className="flex items-center gap-2">
              <span className="text-cyan-100 font-medium">Disponible de</span>
              <input
                type="text"
                value={tempHours}
                onChange={(e) => setTempHours(e.target.value)}
                className="text-cyan-100 bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 font-medium"
                placeholder="12:00–15:00"
                autoFocus
              />
              <span className="text-cyan-100 font-medium">· Entrada + Principal + Bebida</span>
              <button
                onClick={handleHoursSave}
                className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setTempHours(hours);
                  setIsEditingHours(false);
                }}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="text-cyan-100 mb-5 font-medium">
              Disponible de {hours} · Entrada + Principal + Bebida
              {isEditMode && (
                <button
                  onClick={() => setIsEditingHours(true)}
                  className="ml-2 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </p>
          )}
        </div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-3 gap-4 text-white mb-6">
          {isEditMode ? (
            <>
              {tempItems.map((item, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                    placeholder={`Item ${index + 1}`}
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-dashed border-white/30 text-white hover:bg-white/20 transition-colors"
              >
                <Plus size={20} />
                Agregar item
              </button>
            </>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
              >
                {item}
              </div>
            ))
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {isEditingPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white drop-shadow-lg">$</span>
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="text-2xl font-extrabold text-white bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 w-24"
                  autoFocus
                />
                <button
                  onClick={handlePriceSave}
                  className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setTempPrice(price.toString());
                    setIsEditingPrice(false);
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-2xl font-extrabold text-white drop-shadow-lg">
                ${price.toLocaleString('es-AR')}
                {isEditMode && (
                  <button
                    onClick={() => setIsEditingPrice(true)}
                    className="ml-2 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
          <span className="text-sm text-cyan-200">IVA incluido</span>
        </div>

        {/* Save Items Button */}
        {isEditMode && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleItemsSave}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              Guardar cambios
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
