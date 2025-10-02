'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import OnboardingGuard from '@/components/OnboardingGuard'
import { AppProvider } from '@/contexts/AppProvider'
import { AdminView } from '@/types'
import {
  Eye,
  Home,
  Package,
  ShoppingCart,
  Tag,
  Filter,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import {
  AdminOrders,
  AdminOverview,
  AdminProducts,
  AdminVisibility,
  AdminTags,
  AdminFilters,
  AdminSettings,
} from './components'

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'overview', label: 'Resumen', icon: Home, color: 'bg-blue-500' },
    { id: 'orders', label: 'Ordenes', icon: ShoppingCart, color: 'bg-green-500' },
    { id: 'products', label: 'Productos', icon: Package, color: 'bg-purple-500' },
    { id: 'visibility', label: 'Visibilidad', icon: Eye, color: 'bg-orange-500' },
    { id: 'tags', label: 'Etiquetas', icon: Tag, color: 'bg-pink-500' },
    { id: 'filters', label: 'Filtros', icon: Filter, color: 'bg-indigo-500' },
    { id: 'settings', label: 'Configuración', icon: Settings, color: 'bg-gray-500' },
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
      case 'filters':
        return <AdminFilters />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminOverview />
    }
  }

  const currentItem = navigationItems.find((item) => item.id === activeView)

  return (
    <ProtectedRoute requireAdmin={true}>
      <OnboardingGuard>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 pt-16">
            {/* Mobile Admin Navigation - Floating */}
            <div className="lg:hidden fixed top-20 left-4 right-4 z-30">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentItem?.label || 'Panel Admin'}
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {isMobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <nav className="p-2">
                    <div className="space-y-1">
                      {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeView === item.id
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveView(item.id as AdminView)
                              setIsMobileMenuOpen(false)
                            }}
                            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
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
                            {/* {isActive && <ChevronDown className="w-4 h-4 ml-auto" />} */}
                          </button>
                        )
                      })}
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            <div className="px-4 py-6 lg:px-8 pt-24 lg:pt-6">
              <div className="mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Desktop Sidebar Navigation */}
                  <div className="hidden lg:block lg:w-64">
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

                  {/* Main Content */}
                  <div className="flex-1">{renderActiveView()}</div>
                </div>
              </div>
            </div>
          </div>
        </AppProvider>
      </OnboardingGuard>
    </ProtectedRoute>
  )
}
