'use client'

import { AdminGuard } from '@/components/AdminGuard'
import { useMenuContext } from '@/contexts/MenuContextProvider'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useCartEnabled } from '@/hooks/useCartEnabled'
import { useCategoryOperations } from '@/hooks/useCategoryOperations'
import { useMenuFilters } from '@/hooks/useMenuFilters'
import { Category, MenuItem } from '@/types'
import { motion } from 'framer-motion'
import { memo } from 'react'
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
} from './index'

function MenuContentComponent() {
  const { loading: loadingMenu, categories, filters, items, restaurant } = useMenuData()

  const {
    isEditMode,
    selectedItem,
    isModalOpen,
    setSelectedItem,
    setIsModalOpen,
    newItems,
    setIsEditMode,
  } = useMenuContext()
  const isCartEnabled = useCartEnabled()

  const { handleAddCategory } = useCategoryOperations()

  const { activeFilter, setActiveFilter, filteredCategories } = useMenuFilters(
    items || [],
    filters || [],
  )

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const showLoader = loadingMenu

  if (showLoader) {
    return <LoadingScreen />
  }

  const categoriesWithItems = filteredCategories(categories || [], newItems)

  return (
    <>
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
        />

        <FilterBar
          filters={filters || []}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <EditableDailyMenu isEditMode={isEditMode} />

        <div className="max-w-6xl mx-auto space-y-12">
          {categoriesWithItems.map(
            ({ category, items }: { category: Category; items: MenuItem[] }) =>
              !category.isVisible ? null : (
                <EditableMenuCategory
                  key={category.key}
                  category={category}
                  items={items}
                  onItemClick={handleItemClick}
                  isEditMode={isEditMode}
                  isCartEnabled={isCartEnabled}
                />
              ),
          )}

          <AddCategoryButton isEditMode={isEditMode} onAddCategory={handleAddCategory} />
        </div>
      </motion.main>

      {/* Edit Mode Toggle */}
      <AdminGuard>
        <EditModeToggle isEditMode={isEditMode} onToggle={() => setIsEditMode(!isEditMode)} />
      </AdminGuard>

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        isCartEnabled={isCartEnabled}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
      />
    </>
  )
}

export const MenuContent = memo(MenuContentComponent)
