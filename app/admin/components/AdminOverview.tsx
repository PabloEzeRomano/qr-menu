'use client'

import { useOrders } from '@/hooks/useOrders'
import { useMenuData } from '@/contexts/MenuDataProvider'
import OrdersTable from './OrdersTable'
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { useEffect } from 'react'

export default function AdminOverview() {
  const { orders, loading: ordersLoading, getTotalRevenue, getOrdersCount } = useOrders()
  const { items, categories, restaurant, refreshItems } = useMenuData()

  useEffect(() => {
    refreshItems(true)
  }, [refreshItems])

  const revenue = getTotalRevenue()
  const orderStats = getOrdersCount()
  const visibleItems = items?.filter((item) => item.isVisible) || []
  const hiddenItems = items?.filter((item) => !item.isVisible) || []

  const stats = [
    {
      name: 'Total Ingresos',
      value: `$${revenue.toLocaleString('es-AR')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Órdenes',
      value: orderStats.total.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Items del Menú',
      value: `${visibleItems.length} visibles, ${hiddenItems.length} ocultos`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Categorias',
      value: categories?.length?.toString() || '0',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const orderStatusStats = [
    {
      name: 'Pendientes',
      value: orderStats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Aprobadas',
      value: orderStats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Rechazadas',
      value: orderStats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Canceladas',
      value: orderStats.cancelled,
      icon: AlertCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ]

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resumen</h2>
        <p className="text-gray-600">Rendimiento del restaurante y métricas clave</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${stat.bgColor}`}
                    >
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Desglose de Estados de Orden</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {orderStatusStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${stat.bgColor}`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Órdenes Recientes</h3>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay órdenes todavía</p>
            </div>
          ) : (
            <OrdersTable orders={orders} maxRows={5} />
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      {restaurant && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Restaurante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="text-sm text-gray-900">{restaurant.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                <dd className="text-sm text-gray-900">{restaurant.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="text-sm text-gray-900">{restaurant.address || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="text-sm text-gray-900">{restaurant.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{restaurant.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Carrito Habilitado</dt>
                <dd className="text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      restaurant.hasCart ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {restaurant.hasCart ? 'Sí' : 'No'}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
