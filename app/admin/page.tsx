'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { AppProvider } from '@/contexts/AppProvider'
import { AdminView } from '@/types'
import { Eye, Home, Package, ShoppingCart, Tag } from 'lucide-react'
import { useState } from 'react'
import { AdminOrders, AdminOverview, AdminProducts, AdminVisibility, AdminTags } from './components'

export default function AdminPage() {
  // const { user, isAdmin, logout } = useAuth()
  const [activeView, setActiveView] = useState<AdminView>('overview')

  const navigationItems = [
    { id: 'overview', label: 'Resumen', icon: Home, color: 'bg-blue-500' },
    { id: 'orders', label: 'Ordenes', icon: ShoppingCart, color: 'bg-green-500' },
    { id: 'products', label: 'Productos', icon: Package, color: 'bg-purple-500' },
    { id: 'visibility', label: 'Visibilidad', icon: Eye, color: 'bg-orange-500' },
    { id: 'tags', label: 'Etiquetas', icon: Tag, color: 'bg-pink-500' },
  ]

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverview />
      case 'orders':
        return <AdminOrders />
      case 'products':
        return <AdminProducts />
      case 'visibility':
        return <AdminVisibility />
      case 'tags':
        return <AdminTags />
      default:
        return <AdminOverview />
    }
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AppProvider>
        <div className="min-h-screen bg-gray-50 px-4 py-12">
          {/* Header */}
          {/* <div className="bg-white shadow-sm border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                  <div className="hidden sm:block text-sm text-gray-500">
                    Bienvenido, {user?.displayName || user?.email}
                    {isAdmin && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Menú
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir QR
                  </button>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:w-64">
                {/* Mobile Navigation - Row Layout */}
                <div className="lg:hidden mb-6">
                  <nav className="flex space-x-1 overflow-x-auto pb-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeView === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveView(item.id as AdminView)}
                          className={`flex-shrink-0 flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center mb-1 ${item.color}`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-center leading-tight">{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Desktop Navigation - Column Layout */}
                <div className="hidden lg:block">
                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeView === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveView(item.id as AdminView)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${item.color}`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Quick Actions */}
                {/* <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/demo-menu"
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    >
                      Editar Items del Menú
                    </Link>
                    <Link
                      href="/"
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    >
                      Ver Menú Público
                    </Link>
                  </div>
                </div> */}
              </div>

              {/* Main Content */}
              <div className="flex-1">{renderActiveView()}</div>
            </div>
          </div>
        </div>
      </AppProvider>
    </ProtectedRoute>
  )
}
