'use client'

import { AdminGuard } from '@/components/AdminGuard'
import { useMenuData } from '@/hooks/useMenuData'
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  setDailyMenu,
  updateCategory,
  updateItem,
  uploadItemImage,
} from '@/lib/menuCRUD'
import { Category, DailyMenu, MenuItem } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  AddCategoryButton,
  AnimatedBackground,
  EditableDailyMenu,
  EditableHeader,
  EditableMenuCategory,
  EditModeToggle,
  FilterBar,
  ItemModal,
  LoadingScreen,
} from './components'

export default function DemoMenu() {
  const { loading: loadingMenu, categories, filters, items, dailyMenu, errors } = useMenuData()

  // UI state
  const [filter, setFilter] = useState('all')
  const [loadingAnim, setLoadingAnim] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Header (local)
  const [title, setTitle] = useState('🍽️ Don Julio Parrilla')
  const [subtitle, setSubtitle] = useState('Menú digital · Actualizado al instante')

  // Loader animado (Lottie) breve para la entrada
  useEffect(() => {
    const t = setTimeout(() => setLoadingAnim(false), 1000)
    return () => clearTimeout(t)
  }, [])

  // Filtro de ítems
  const filteredItems = useMemo(() => {
    if (!items) return []
    if (filter === 'all') return items
    return items.filter((i: MenuItem) => i.tags?.includes?.(filter) || i.diet?.includes?.(filter))
  }, [filter, items])

  const filteredCategories = useMemo(() => {
    return (categories || []).map((category: Category) => {
      const its = filteredItems.filter((i: MenuItem) => i.category === category.key)
      return { category, items: its }
    })
  }, [categories, filteredItems])

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  // === Handlers de edición (con Firestore CRUD) ===

  // Header (local)
  const handleTitleChange = (newTitle: string) => setTitle(newTitle)
  const handleSubtitleChange = (newSubtitle: string) => setSubtitle(newSubtitle)

  const handleDailyMenuChange = async (
    field: keyof DailyMenu,
    value: string | number | string[],
  ) => {
    const base: DailyMenu = {
      title: dailyMenu?.title ?? 'Menú del día',
      hours: dailyMenu?.hours ?? '12:00–15:00',
      price: dailyMenu?.price ?? 0,
      items: dailyMenu?.items ?? [],
    }
    const next = { ...base, [field]: value } as DailyMenu
    try {
      await setDailyMenu(next)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error guardando el Menú del día')
    }
  }

  const handleCategoryUpdate = async (categoryKey: string, updated: Category) => {
    try {
      await updateCategory(categoryKey, {
        label: updated.label,
        icon: updated.icon,
      })
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error actualizando la categoría')
    }
  }

  const handleCategoryDelete = async (categoryKey: string) => {
    try {
      await deleteCategory(categoryKey)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'No se pudo borrar la categoría (puede tener ítems)')
    }
  }

  const handleItemUpdate = async (updatedItem: MenuItem) => {
    try {
      const { id, ...patch } = updatedItem
      await updateItem(id, patch)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error guardando el plato')
    }
  }

  const handleItemDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error eliminando el plato')
    }
  }

  const handleAddItem = async (categoryKey: string) => {
    const newItem: Omit<MenuItem, 'id'> = {
      name: 'Nuevo plato',
      description: 'Descripción del nuevo plato',
      price: 0,
      category: categoryKey,
      tags: [],
      diet: [],
      img: '/menu-images/placeholder.png',
    }
    try {
      await createItem(newItem)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error creando el plato')
    }
  }

  const handleAddCategory = async (newCategory: Category) => {
    try {
      await createCategory({
        key: newCategory.key,
        label: newCategory.label,
        icon: newCategory.icon,
      })
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error creando la categoría')
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      await uploadItemImage(file, selectedItem?.id ?? '')
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error subiendo la imagen')
    }
  }

  const showLoader = loadingAnim || loadingMenu

  return (
    <>
      <AnimatePresence mode="sync">
        {showLoader ? (
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

            {(errors.categories || errors.filters || errors.items || errors.dailyMenu) && (
              <div className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-600/20 border border-red-600/40 p-3 text-sm text-red-100">
                {errors.categories && <div>Categories: {errors.categories}</div>}
                {errors.filters && <div>Filters: {errors.filters}</div>}
                {errors.items && <div>Items: {errors.items}</div>}
                {errors.dailyMenu && <div>DailyMenu: {errors.dailyMenu}</div>}
              </div>
            )}

            <EditableHeader
              title={title}
              subtitle={subtitle}
              isEditMode={isEditMode}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
            />

            <FilterBar filters={filters || []} activeFilter={filter} onFilterChange={setFilter} />

            <EditableDailyMenu
              title={dailyMenu?.title ?? 'Menú del día'}
              hours={dailyMenu?.hours ?? '12:00–15:00'}
              price={dailyMenu?.price ?? 0}
              items={dailyMenu?.items ?? []}
              isEditMode={isEditMode}
              onTitleChange={(title) => handleDailyMenuChange('title', title)}
              onHoursChange={(hours) => handleDailyMenuChange('hours', hours)}
              onPriceChange={(price) => handleDailyMenuChange('price', price)}
              onItemsChange={(it) => handleDailyMenuChange('items', it)}
            />

            <div className="max-w-6xl mx-auto space-y-12">
              {(filteredCategories || []).map(
                ({ category, items }: { category: Category; items: MenuItem[] }) => (
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
                    onImageUpload={handleImageUpload}
                  />
                ),
              )}

              <AddCategoryButton isEditMode={isEditMode} onAddCategory={handleAddCategory} />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Edit Mode Toggle */}
      <AdminGuard>
        <EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />
      </AdminGuard>

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
      />
    </>
  )
}
