'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/app/components/Navbar';
import {
  LoadingScreen,
  AnimatedBackground,
  EditableHeader,
  EditableDailyMenu,
  EditableMenuCategory,
  AddCategoryButton,
  EditModeToggle,
  FilterBar,
  ItemModal,
} from './components';
import data from './data.json';
import { Category, DailyMenu, MenuItem } from './types';

export default function DemoMenu() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable state
  const [menuData, setMenuData] = useState(() => {
    // Try to load from localStorage first, fallback to default data
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo-menu-data');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          console.warn('Failed to parse saved menu data, using default');
        }
      }
    }
    return {
      title: '🍽️ Don Julio Parrilla',
      subtitle: 'Menú digital · Actualizado al instante',
      dailyMenu: { ...data.dailyMenu },
      categories: [...data.categories],
      items: [...data.items],
    };
  });

  // Save to localStorage whenever menuData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-menu-data', JSON.stringify(menuData));
    }
  }, [menuData]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Simula carga + animación Lottie
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return menuData.items;
    }
    return menuData.items.filter(
      (i: MenuItem) => i.tags.includes(filter) || i.diet.includes(filter)
    );
  }, [filter, menuData.items]);

  // Memoize the filtered categories to prevent unnecessary re-renders
  const filteredCategories = useMemo(() => {
    return menuData.categories.map((category: Category) => {
      const items = filteredItems.filter(
        (i: MenuItem) => i.category === category.key
      );
      return { category, items };
    });
  }, [menuData.categories, filteredItems]);

  // Edit mode handlers
  const handleTitleChange = (newTitle: string) => {
    setMenuData((prev: typeof menuData) => ({ ...prev, title: newTitle }));
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      subtitle: newSubtitle,
    }));
  };

  const handleDailyMenuChange = (
    field: keyof DailyMenu,
    value: string | number | string[]
  ) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      dailyMenu: { ...prev.dailyMenu, [field]: value },
    }));
  };

  const handleCategoryUpdate = (
    categoryKey: string,
    updatedCategory: Category
  ) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      categories: prev.categories.map((cat: Category) =>
        cat.key === categoryKey ? updatedCategory : cat
      ),
    }));
  };

  const handleCategoryDelete = (categoryKey: string) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      categories: prev.categories.filter(
        (cat: Category) => cat.key !== categoryKey
      ),
      items: prev.items.filter(
        (item: MenuItem) => item.category !== categoryKey
      ),
    }));
  };

  const handleItemUpdate = (updatedItem: MenuItem) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      items: prev.items.map((item: MenuItem) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    }));
  };

  const handleItemDelete = (itemId: string) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      items: prev.items.filter((item: MenuItem) => item.id !== itemId),
    }));
  };

  const handleAddItem = (categoryKey: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'Nuevo plato',
      description: 'Descripción del nuevo plato',
      price: 0,
      category: categoryKey,
      tags: [],
      diet: [],
      img: '/menu-images/placeholder.png',
    };

    setMenuData((prev: typeof menuData) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleAddCategory = (newCategory: Category) => {
    setMenuData((prev: typeof menuData) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  // Reset to default data
  const resetToDefault = () => {
    if (
      confirm(
        '¿Estás seguro de que quieres restaurar el menú original? Se perderán todos los cambios.'
      )
    ) {
      const defaultData = {
        title: '🍽️ Don Julio Parrilla',
        subtitle: 'Menú digital · Actualizado al instante',
        dailyMenu: { ...data.dailyMenu },
        categories: [...data.categories],
        items: [...data.items],
      };
      setMenuData(defaultData);
      localStorage.removeItem('demo-menu-data');
    }
  };

  return (
    <>
      <AnimatePresence mode="sync">
        {loading ? (
          <LoadingScreen />
        ) : (
          <motion.main
            key="demo-menu"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="relative min-h-screen px-4 py-12 text-white overflow-hidden"
          >
            <AnimatedBackground />

            <EditableHeader
              title={menuData.title}
              subtitle={menuData.subtitle}
              isEditMode={isEditMode}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
            />

            <FilterBar
              filters={data.filters}
              activeFilter={filter}
              onFilterChange={setFilter}
            />

            <EditableDailyMenu
              title={menuData.dailyMenu.title}
              hours={menuData.dailyMenu.hours}
              price={menuData.dailyMenu.price}
              items={menuData.dailyMenu.items}
              isEditMode={isEditMode}
              onTitleChange={(title) => handleDailyMenuChange('title', title)}
              onHoursChange={(hours) => handleDailyMenuChange('hours', hours)}
              onPriceChange={(price) => handleDailyMenuChange('price', price)}
              onItemsChange={(items) => handleDailyMenuChange('items', items)}
            />

            {/* Secciones por categoría */}
            <div className="max-w-6xl mx-auto space-y-12">
              {filteredCategories.map(({ category, items }: { category: Category; items: MenuItem[] }) => (
                <EditableMenuCategory
                  key={category.key}
                  category={category}
                  items={items}
                  onItemClick={handleItemClick}
                  isEditMode={isEditMode}
                  onCategoryUpdate={handleCategoryUpdate}
                  onCategoryDelete={handleCategoryDelete}
                  onItemUpdate={handleItemUpdate}
                  onItemDelete={handleItemDelete}
                  onAddItem={handleAddItem}
                />
              ))}

              {/* Add Category Button */}
              <AddCategoryButton
                isEditMode={isEditMode}
                onAddCategory={handleAddCategory}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Edit Mode Toggle */}
      <EditModeToggle
        isEditMode={isEditMode}
        onToggle={() => setIsEditMode(!isEditMode)}
        onReset={resetToDefault}
      />

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </>
  );
}
