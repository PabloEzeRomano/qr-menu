'use client'

import { MenuItem } from '@/types'
import { Eye, EyeOff, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface ProductAnalytics extends MenuItem {
  totalOrders: number
  totalQuantity: number
  totalRevenue: number
  avgOrderValue: number
}

interface ProductsTableProps {
  products: ProductAnalytics[]
  showActions?: boolean
  onEditProduct?: (product: ProductAnalytics) => void
  onToggleVisibility?: (productId: string) => void
  onDeleteProduct?: (productId: string) => void
  actionLoading?: string | null
  maxRows?: number
  getCategoryName: (categoryKey: string) => string
  getCategoryIcon: (categoryKey: string) => string
  getTagById: (tagId: string) => { label: string } | undefined
}

export default function ProductsTable({
  products,
  showActions = false,
  onEditProduct,
  onToggleVisibility,
  onDeleteProduct,
  actionLoading,
  maxRows,
  getCategoryName,
  getCategoryIcon,
  getTagById,
}: ProductsTableProps) {
  const getVisibilityIcon = (isVisible: boolean) => {
    return isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
  }

  const getVisibilityColor = (isVisible: boolean) => {
    return isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getVisibilityLabel = (isVisible: boolean) => {
    return isVisible ? 'Visible' : 'Oculto'
  }

  const getProductActions = (product: ProductAnalytics) => {
    if (!showActions) return []

    const actions = []

    if (onToggleVisibility) {
      actions.push({
        label: product.isVisible ? 'Ocultar Producto' : 'Mostrar Producto',
        icon: product.isVisible ? EyeOff : Eye,
        action: () => onToggleVisibility(product.id),
        className: product.isVisible
          ? 'text-orange-600 hover:text-orange-800'
          : 'text-green-600 hover:text-green-800',
      })
    }

    if (onEditProduct) {
      actions.push({
        label: 'Editar Producto',
        icon: Edit2,
        action: () => onEditProduct(product),
        className: 'text-indigo-600 hover:text-indigo-800',
      })
    }

    if (onDeleteProduct) {
      actions.push({
        label: 'Eliminar Producto',
        icon: Trash2,
        action: () => onDeleteProduct(product.id),
        className: 'text-red-600 hover:text-red-800',
      })
    }

    return actions
  }

  const displayProducts = maxRows ? products.slice(0, maxRows) : products

  return (
    <div className="overflow-x-auto w-full">
      <table
        className="w-full divide-y divide-gray-200"
        style={{ minWidth: showActions ? '900px' : '700px' }}
      >
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
            {showActions && (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <Image
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                      src={product.img}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-24 sm:max-w-32 lg:max-w-xs">
                      {product.description}
                    </div>
                    <div className="text-xs text-gray-400 md:hidden">
                      {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getCategoryIcon(product.category)}</span>
                  <span className="text-sm text-gray-900 truncate">
                    {getCategoryName(product.category)}
                  </span>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${product.price.toLocaleString('es-AR')}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getVisibilityColor(product.isVisible)}`}
                >
                  {getVisibilityIcon(product.isVisible)}
                  <span className="ml-1 hidden sm:inline">
                    {getVisibilityLabel(product.isVisible)}
                  </span>
                </span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                <span className="hidden lg:inline">{product.totalQuantity} vendidos</span>
                <span className="lg:hidden">{product.totalQuantity}</span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden xl:table-cell">
                ${product.totalRevenue.toLocaleString('es-AR')}
              </td>
              <td className="px-3 py-4 whitespace-nowrap hidden xl:table-cell">
                <div className="flex flex-wrap gap-1">
                  {product.tagIds?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {getTagById(tag)?.label}
                    </span>
                  ))}
                  {product.tagIds?.length && product.tagIds?.length > 2 && (
                    <span className="text-xs text-gray-500">+{product.tagIds?.length - 2}</span>
                  )}
                </div>
              </td>
              {showActions && (
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {getProductActions(product).map((action, index) => {
                      const Icon = action.icon
                      const isLoading = actionLoading === product.id

                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          disabled={isLoading}
                          className={`${action.className} flex items-center disabled:opacity-50`}
                          title={action.label}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
