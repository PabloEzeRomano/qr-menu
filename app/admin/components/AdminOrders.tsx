'use client'

import { useState } from 'react'

import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  ShoppingCart,
  XCircle,
} from 'lucide-react'

import { Input, Select } from '@/components/ui'
import { useOrderOperations } from '@/hooks/useOrderOperations'
import { useOrders } from '@/hooks/useOrders'
import { Order } from '@/types'

import OrdersTable from './OrdersTable'

export default function AdminOrders() {
  const { orders, loading, getOrdersByStatus, updateOrder, removeOrder } = useOrders()
  const { updateOrderStatus, deleteOrder } = useOrderOperations({ updateOrder, removeOrder })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setActionLoading(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      setActionLoading(orderId)
      try {
        await deleteOrder(orderId)
      } catch (error) {
        console.error('Error deleting order:', error)
      } finally {
        setActionLoading(null)
      }
    }
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h2>
        <p className="text-gray-600">Ver y cancelar órdenes de los clientes</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar órdenes por ID, mesa o productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                containerClassName="mb-0"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
              options={[
                { value: 'all', label: 'Todos los Estados' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'approved', label: 'Aprobada' },
                { value: 'rejected', label: 'Rechazada' },
                { value: 'cancelled', label: 'Cancelada' },
              ]}
              containerClassName="mb-0"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-medium text-gray-900">Órdenes ({filteredOrders.length})</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span className="break-all">
                Ingresos Totales: $
                {orders
                  .filter((o) => o.status === 'approved')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron órdenes</p>
            </div>
          ) : (
            <OrdersTable
              orders={filteredOrders}
              showActions={true}
              onViewOrder={setSelectedOrder}
              onCancelOrder={(orderId) => handleStatusUpdate(orderId, 'cancelled')}
              onDeleteOrder={handleDeleteOrder}
              actionLoading={actionLoading}
            />
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles de la Orden - {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mesa</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.table || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedOrder.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : selectedOrder.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : selectedOrder.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedOrder.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {selectedOrder.status === 'approved' && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {selectedOrder.status === 'rejected' && (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {selectedOrder.status === 'cancelled' && (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        <span className="ml-1">
                          {selectedOrder.status === 'pending'
                            ? 'Pendiente'
                            : selectedOrder.status === 'approved'
                              ? 'Aprobada'
                              : selectedOrder.status === 'rejected'
                                ? 'Rechazada'
                                : 'Cancelada'}
                        </span>
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${selectedOrder.total.toLocaleString('es-AR')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString('es-AR')
                        : 'N/A'}
                    </dd>
                  </div>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2">Productos</dt>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">Cantidad: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.unit_price * item.quantity).toLocaleString('es-AR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.paymentId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID de Pago</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.paymentId}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
