"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import EditableMenuItem from "./EditableMenuItem";

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

interface Category {
  key: string;
  label: string;
  icon: string;
}

interface EditableMenuCategoryProps {
  category: Category;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  isEditMode: boolean;
  onCategoryUpdate: (categoryKey: string, updatedCategory: Category) => void;
  onCategoryDelete: (categoryKey: string) => void;
  onItemUpdate: (updatedItem: MenuItem) => void;
  onItemDelete: (itemId: string) => void;
  onAddItem: (categoryKey: string) => void;
}

export default function EditableMenuCategory({
  category,
  items,
  onItemClick,
  isEditMode,
  onCategoryUpdate,
  onCategoryDelete,
  onItemUpdate,
  onItemDelete,
  onAddItem,
}: EditableMenuCategoryProps) {
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [tempCategory, setTempCategory] = useState({ ...category });

  if (!items.length && !isEditMode) return null;

  const handleCategorySave = () => {
    if (tempCategory.label.trim() && tempCategory.icon.trim()) {
      onCategoryUpdate(category.key, tempCategory);
      setIsEditingCategory(false);
    }
  };

  const handleCategoryCancel = () => {
    setTempCategory({ ...category });
    setIsEditingCategory(false);
  };

  const handleCategoryDelete = () => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar la categoría "${category.label}"?`,
      )
    ) {
      onCategoryDelete(category.key);
    }
  };

  return (
    <section>
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          {isEditingCategory ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempCategory.icon}
                onChange={(e) =>
                  setTempCategory((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="text-3xl bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 text-center w-16"
                placeholder="🍽️"
                autoFocus
              />
              <button
                onClick={handleCategorySave}
                className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCategoryCancel}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <span className="text-3xl" aria-hidden>
              {category.icon}
              {isEditMode && (
                <button
                  onClick={() => setIsEditingCategory(true)}
                  className="ml-2 p-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </span>
          )}
        </div>

        <div className="relative">
          {isEditingCategory ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempCategory.label}
                onChange={(e) =>
                  setTempCategory((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
                className="text-2xl font-bold text-white bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-300 drop-shadow-lg"
                placeholder="Nombre de categoría"
              />
            </div>
          ) : (
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
              {category.label}
            </h3>
          )}
        </div>

        {/* Category Actions */}
        {isEditMode && !isEditingCategory && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => onAddItem(category.key)}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus size={14} />
              Agregar item
            </button>
            <button
              onClick={handleCategoryDelete}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.12 },
          },
        }}
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 18, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            initial="hidden"
            animate="show"
            layout
          >
            <EditableMenuItem
              item={item}
              onItemClick={onItemClick}
              isEditMode={isEditMode}
              onUpdate={onItemUpdate}
              onDelete={onItemDelete}
            />
          </motion.div>
        ))}

        {/* Empty State */}
        {items.length === 0 && isEditMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-dashed border-white/30">
              <p className="text-white/60 text-lg mb-4">
                Esta categoría no tiene items
              </p>
              <button
                onClick={() => onAddItem(category.key)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Agregar primer item
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
