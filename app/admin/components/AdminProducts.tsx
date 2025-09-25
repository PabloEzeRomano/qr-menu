'use client'

import { useMenuData } from '@/contexts/MenuDataProvider'
import { useOrders } from '@/hooks/useOrders'
import { DollarSign, Eye, EyeOff, Package, Search } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTags } from '@/contexts/TagsProvider'
import ProductsTable from './ProductsTable'
import { updateItem, deleteItem } from '@/lib/menuCRUD'

export default function AdminProducts() {
  const { items, categories, loading, refreshItems } = useMenuData()
  const { orders } = useOrders()
  const { getTagById } = useTags()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Ensure we load all items (including hidden ones) when component mounts
  useEffect(() => {
    refreshItems(true)
  }, [refreshItems])

  // Calculate product analytics
  const getProductAnalytics = () => {
    if (!items || !orders) return []

    const productStats = items.map((item) => {
      const itemOrders = orders.filter((order) =>
        order.items.some((orderItem) => orderItem.id === item.id),
      )

      const totalQuantity = itemOrders.reduce((sum, order) => {
        const orderItem = order.items.find((orderItem) => orderItem.id === item.id)
        return sum + (orderItem?.quantity || 0)
      }, 0)

      const totalRevenue = itemOrders.reduce((sum, order) => {
        const orderItem = order.items.find((orderItem) => orderItem.id === item.id)
        return sum + (orderItem?.unit_price || 0) * (orderItem?.quantity || 0)
      }, 0)

      return {
        ...item,
        totalOrders: itemOrders.length,
        totalQuantity,
        totalRevenue,
        avgOrderValue: itemOrders.length > 0 ? totalRevenue / itemOrders.length : 0,
      }
    })

    return productStats
  }

  const productAnalytics = getProductAnalytics()

  const filteredItems = productAnalytics.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && item.isVisible) ||
      (visibilityFilter === 'hidden' && !item.isVisible)

    return matchesSearch && matchesCategory && matchesVisibility
  })

  const getCategoryName = (categoryKey: string) => {
    return categories?.find((cat) => cat.key === categoryKey)?.label || categoryKey
  }

  const getCategoryIcon = (categoryKey: string) => {
    return categories?.find((cat) => cat.key === categoryKey)?.icon || '🍽️'
  }

  const getTopSellingItems = () => {
    return [...productAnalytics].sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 5)
  }

  const getTopRevenueItems = () => {
    return [...productAnalytics].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5)
  }

  // Action handlers
  const handleToggleVisibility = async (productId: string) => {
    setActionLoading(productId)
    try {
      // Find the current product to get its current visibility state
      const currentProduct = items.find((item) => item.id === productId)
      if (!currentProduct) {
        console.error('Product not found:', productId)
        return
      }

      // Toggle the visibility
      const newVisibility = !currentProduct.isVisible

      // Update the item via API
      await updateItem(productId, { isVisible: newVisibility })

      // Refresh the items to get the updated data
      await refreshItems(true) // Pass true to show all items (including hidden ones)

      console.log(`Product ${productId} visibility toggled to: ${newVisibility}`)
    } catch (error) {
      console.error('Error toggling product visibility:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit product:', product)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setActionLoading(productId)
      try {
        // Delete the product via API
        await deleteItem(productId)

        // Refresh the items to get the updated data
        await refreshItems(true) // Pass true to show all items (including hidden ones)

        console.log(`Product ${productId} deleted successfully`)
      } catch (error) {
        console.error('Error deleting product:', error)
      } finally {
        setActionLoading(null)
      }
    }
  }

  const totalRevenue = productAnalytics.reduce((sum, item) => sum + item.totalRevenue, 0)
  const totalItems = items?.length || 0
  const visibleItems = items?.filter((item) => item.isVisible).length || 0
  const hiddenItems = items?.filter((item) => !item.isVisible).length || 0

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics de Productos</h2>
        <p className="text-gray-600">
          Analizar el rendimiento y los datos de ventas de los productos
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Productos</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-green-100">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Visible</dt>
                  <dd className="text-lg font-medium text-gray-900">{visibleItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-red-100">
                  <EyeOff className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Oculto</dt>
                  <dd className="text-lg font-medium text-gray-900">{hiddenItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-purple-100">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Ingresos</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalRevenue.toLocaleString('es-AR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Ventas</h3>
            <div className="space-y-3">
              {getTopSellingItems().map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm">{item.totalQuantity} vendidos</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${item.totalRevenue.toLocaleString('es-AR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Revenue Items */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Ingresos</h3>
            <div className="space-y-3">
              {getTopRevenueItems().map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.totalOrders} órdenes</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${item.totalRevenue.toLocaleString('es-AR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todas las Categorías</option>
              {categories?.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-32">
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'visible' | 'hidden')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todos los Items</option>
              <option value="visible">Visible</option>
              <option value="hidden">Oculto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Productos ({filteredItems.length})
          </h3>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <ProductsTable
              products={filteredItems}
              showActions={true}
              // onEditProduct={handleEditProduct}
              onToggleVisibility={handleToggleVisibility}
              // onDeleteProduct={handleDeleteProduct}
              actionLoading={actionLoading}
              getCategoryName={getCategoryName}
              getCategoryIcon={getCategoryIcon}
              getTagById={getTagById}
            />
          )}
        </div>
      </div>
    </div>
  )
}
