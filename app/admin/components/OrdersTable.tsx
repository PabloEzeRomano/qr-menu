'use client'

import { Order } from '@/types'
import { AlertCircle, CheckCircle, Clock, Eye, Trash2, XCircle } from 'lucide-react'

interface OrdersTableProps {
  orders: Order[]
  showActions?: boolean
  onViewOrder?: (order: Order) => void
  onCancelOrder?: (orderId: string) => void
  onDeleteOrder?: (orderId: string) => void
  actionLoading?: string | null
  maxRows?: number
}

export default function OrdersTable({
  orders,
  showActions = false,
  onViewOrder,
  onCancelOrder,
  onDeleteOrder,
  actionLoading,
  maxRows,
}: OrdersTableProps) {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('es-AR')
  }

  const getStatusActions = (order: Order) => {
    if (!showActions) return []

    const actions = []

    // Only allow canceling pending or approved orders
    if ((order.status === 'pending' || order.status === 'approved') && onCancelOrder) {
      actions.push({
        label: 'Cancelar Orden',
        icon: XCircle,
        action: () => onCancelOrder(order.id),
        className: 'text-orange-600 hover:text-orange-800',
      })
    }

    // Always allow deleting orders
    if (onDeleteOrder) {
      actions.push({
        label: 'Eliminar Orden',
        icon: Trash2,
        action: () => onDeleteOrder(order.id),
        className: 'text-red-600 hover:text-red-800',
      })
    }

    return actions
  }

  const displayOrders = maxRows ? orders.slice(0, maxRows) : orders

  return (
    <div className="overflow-x-auto w-full">
      <table
        className="w-full divide-y divide-gray-200"
        style={{ minWidth: showActions ? '800px' : '600px' }}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orden
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mesa
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
              Fecha
            </th>
            {showActions && (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.id.slice(0, 6)}...</div>
                <div className="text-xs text-gray-500 hidden sm:block">ID: {order.id}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.table || 'N/A'}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="hidden lg:inline">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </span>
                <span className="lg:hidden">{order.items.length}</span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${order.total.toLocaleString('es-AR')}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-1 hidden sm:inline">{getStatusLabel(order.status)}</span>
                </span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                {formatDate(order.createdAt)}
              </td>
              {showActions && (
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onViewOrder && (
                      <button
                        onClick={() => onViewOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {getStatusActions(order).map((action, index) => {
                      const Icon = action.icon
                      const isLoading = actionLoading === order.id

                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          disabled={isLoading}
                          className={`${action.className} flex items-center disabled:opacity-50 ml-2`}
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
