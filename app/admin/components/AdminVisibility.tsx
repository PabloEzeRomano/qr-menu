'use client'

import { useState, useEffect } from 'react'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useCategoryOperations } from '@/hooks/useCategoryOperations'
import { useRestaurantOperations } from '@/hooks/useRestaurantOperations'
import {
  Eye,
  EyeOff,
  Tag,
  Calendar,
  Package,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
} from 'lucide-react'
import { Category, DailyMenu } from '@/types'

export default function AdminVisibility() {
  const { categories, dailyMenu, items, loading } = useMenuData()
  const { handleCategoryUpdate } = useCategoryOperations()
  const { handleDailyMenuSave } = useRestaurantOperations()

  const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>({})
  const [dailyMenuVisibility, setDailyMenuVisibility] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize visibility states
  useEffect(() => {
    if (categories) {
      const initialVisibility: Record<string, boolean> = {}
      categories.forEach((category) => {
        initialVisibility[category.key] = category.isVisible !== false
      })
      setCategoryVisibility(initialVisibility)
    }
    if (dailyMenu) {
      setDailyMenuVisibility(dailyMenu.isVisible !== false)
    }
  }, [categories, dailyMenu])

  const getCategoryStats = (categoryKey: string) => {
    const categoryItems = items?.filter((item) => item.category === categoryKey) || []
    const visibleItems = categoryItems.filter((item) => item.isVisible)
    const hiddenItems = categoryItems.filter((item) => !item.isVisible)

    return {
      total: categoryItems.length,
      visible: visibleItems.length,
      hidden: hiddenItems.length,
    }
  }

  const handleCategoryVisibilityToggle = (categoryKey: string) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }))
  }

  const handleDailyMenuVisibilityToggle = () => {
    setDailyMenuVisibility((prev) => !prev)
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      // Update categories visibility
      if (categories) {
        for (const category of categories) {
          const newVisibility = categoryVisibility[category.key]
          if (newVisibility !== (category.isVisible !== false)) {
            await handleCategoryUpdate(category.key, {
              ...category,
              isVisible: newVisibility,
            })
          }
        }
      }

      // Update daily menu visibility
      if (dailyMenu) {
        const newDailyMenu = {
          ...dailyMenu,
          isVisible: dailyMenuVisibility,
        }
        await handleDailyMenuSave(newDailyMenu)
      }
    } catch (error) {
      console.error('Error saving visibility changes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = () => {
    if (!categories || !dailyMenu) return false

    // Check category changes
    const categoryChanges = categories.some(
      (category) => categoryVisibility[category.key] !== (category.isVisible !== false),
    )

    // Check daily menu changes
    const dailyMenuChanges = dailyMenuVisibility !== (dailyMenu.isVisible !== false)

    return categoryChanges || dailyMenuChanges
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visibility Management</h2>
          <p className="text-gray-600">Control what customers can see on the menu</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={!hasChanges() || isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Daily Menu Visibility */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Daily Menu</h3>
                <p className="text-sm text-gray-500">
                  {dailyMenu?.title || 'No daily menu configured'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDailyMenuVisibilityToggle}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              {dailyMenuVisibility ? (
                <>
                  <ToggleRight className="w-6 h-6 text-green-600" />
                  <span className="text-green-600">Visible</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-500">Hidden</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Visibility */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Categories ({categories?.length || 0})
            </h3>
            <div className="text-sm text-gray-500">Toggle visibility for each category</div>
          </div>

          {!categories || categories.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No categories found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const stats = getCategoryStats(category.key)
                const isVisible = categoryVisibility[category.key]

                return (
                  <div
                    key={category.key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{category.label}</h4>
                        <p className="text-sm text-gray-500">{category.key}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            <span>{stats.total} items</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <Eye className="w-3 h-3" />
                            <span>{stats.visible} visible</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-red-600">
                            <EyeOff className="w-3 h-3" />
                            <span>{stats.hidden} hidden</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCategoryVisibilityToggle(category.key)}
                      className="flex items-center space-x-2 text-sm font-medium"
                    >
                      {isVisible ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-green-600" />
                          <span className="text-green-600">Visible</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-500">Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Visibility Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Daily Menu:</span>
            <span
              className={`ml-2 font-medium ${dailyMenuVisibility ? 'text-green-600' : 'text-red-600'}`}
            >
              {dailyMenuVisibility ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Visible Categories:</span>
            <span className="ml-2 font-medium text-blue-900">
              {Object.values(categoryVisibility).filter(Boolean).length} / {categories?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Total Items:</span>
            <span className="ml-2 font-medium text-blue-900">{items?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
