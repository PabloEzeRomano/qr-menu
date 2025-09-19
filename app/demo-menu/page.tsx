'use client'

import { AdminGuard } from '@/components/AdminGuard'
import { useMenuData } from '@/hooks/useMenuData'
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  patchDailyMenu,
  patchRestaurant,
  updateCategory,
  updateItem,
} from '@/lib/menuCRUD'
import { uploadItemImage } from '@/lib/uploadImage'
import { Category, DailyMenu, MenuItem } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useEffect, useMemo, useState } from 'react'
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
  PaymentStatusHandler,
} from './components'
import { useAuth } from '@/contexts/AuthContextProvider'

type Predicate = { tag?: string; diet?: string }

function matches(item: { tags?: string[]; diet?: string[] }, f?: Predicate) {
  if (!f || (!f.tag && !f.diet)) return true

  const tags = item.tags ?? []
  const diet = item.diet ?? []

  if (f.tag && tags.includes(f.tag)) return true
  if (f.diet && diet.includes(f.diet)) return true

  return false
}

function DemoMenuContent() {
  const {
    loading: loadingMenu,
    categories,
    filters,
    items,
    dailyMenu,
    restaurant,
    refreshItems,
  } = useMenuData()
  const { isAdmin } = useAuth()
  const [filter, setFilter] = useState('all')
  const [loadingAnim, setLoadingAnim] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoadingAnim(false), 1000)
    return () => clearTimeout(t)
  }, [])

  // Refresh items when edit mode changes or admin status changes
  // Admins always see all items, regular users only see visible items
  useEffect(() => {
    refreshItems(isAdmin)
  }, [isAdmin, refreshItems])

  const activeFilter = useMemo(
    () => (filters || []).find((f) => f.key === filter),
    [filters, filter],
  )

  const filteredItems = useMemo(() => {
    if (!items) return []
    return items.filter((it) => matches(it, activeFilter?.predicate))
  }, [items, activeFilter])

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

  const handleTitleChange = (newTitle: string) => patchRestaurant({ ...restaurant, name: newTitle })
  const handleSubtitleChange = (newSubtitle: string) =>
    patchRestaurant({ ...restaurant, description: newSubtitle })

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
      await patchDailyMenu(next)
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

  const handleCategoryDelete = async (categoryKey: string, forceDelete: boolean) => {
    try {
      await deleteCategory(categoryKey, forceDelete)
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'No se pudo borrar la categoría (puede tener ítems)')
    }
  }

  const handleItemUpdate = async (updatedItem: MenuItem) => {
    try {
      const { id, ...patch } = updatedItem
      await updateItem(id, patch)
      // Refresh items to reflect visibility changes
      refreshItems(isAdmin)
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
      img: 'https://vuzhpuvkkrtyiw2d.public.blob.vercel-storage.com/items/placeholder.png',
      isVisible: true,
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

  const handleImageUpload = async (file: File, itemId: string): Promise<string> => {
    try {
      const url = await uploadItemImage(file, itemId)
      return url ?? ''
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Error subiendo la imagen')
    }
    return ''
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

            <EditableHeader
              title={restaurant?.name ?? '🍽️ Restaurant Name'}
              subtitle={restaurant?.description ?? 'Menú digital · Actualizado al instante'}
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
        isEditMode={isEditMode}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
      />
    </>
  )
}

export default function DemoMenu() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DemoMenuContent />
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>
    </Suspense>
  )
}
