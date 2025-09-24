'use client'

import { useMenuData } from '@/contexts/MenuDataProvider'
import { useOrders } from '@/hooks/useOrders'
import { DollarSign, Eye, EyeOff, Package, Search } from 'lucide-react'
import { useState } from 'react'

export default function AdminProducts() {
  const { items, categories, loading } = useMenuData()
  const { orders } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all')

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
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.totalQuantity} vendidos</p>
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
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '900px' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Categoría
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Ventas
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Ingresos
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={item.img}
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-24 sm:max-w-32 lg:max-w-xs">
                              {item.description}
                            </div>
                            <div className="text-xs text-gray-400 md:hidden">
                              {getCategoryIcon(item.category)} {getCategoryName(item.category)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                          <span className="text-sm text-gray-900 truncate">
                            {getCategoryName(item.category)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.price.toLocaleString('es-AR')}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.isVisible
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isVisible ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Oculto</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                        {item.totalQuantity} vendidos
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden xl:table-cell">
                        ${item.totalRevenue.toLocaleString('es-AR')}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
