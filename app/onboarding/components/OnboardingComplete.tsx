'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Button from '@/components/ui/Button'
import { useOnboarding } from '@/contexts/OnboardingProvider'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useRestaurantOperations } from '@/hooks/useRestaurantOperations'

export default function OnboardingComplete() {
  const { data, completeOnboarding, isLoading, error, previousStep, currentStep } = useOnboarding()
  const { handleRestaurantSave } = useRestaurantOperations()
  const { handleError } = useErrorHandler()
  const router = useRouter()

  useEffect(() => {
    // Save restaurant data when component mounts
    const saveRestaurantData = async () => {
      if (data.restaurant.name) {
        try {
          await handleRestaurantSave({
            name: data.restaurant.name,
            description: data.restaurant.description,
            address: data.restaurant.address,
            phone: data.restaurant.phone,
            email: data.restaurant.email,
            website: data.restaurant.website,
            hasCart: data.restaurant.hasCart,
          })
        } catch (error) {
          console.error('Error saving restaurant data:', error)
        }
      }
    }

    saveRestaurantData()
  }, [data.restaurant, handleRestaurantSave])

  const handleComplete = async () => {
    try {
      await completeOnboarding()
      router.push('/admin')
    } catch (error) {
      handleError('error', 'Error al completar la configuración')
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Configuración Completada!</h2>

        <p className="text-lg text-gray-600 mb-8">
          Tu restaurante <strong>{data.restaurant.name}</strong> está listo para recibir pedidos.
          Has configurado exitosamente tu menú digital.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de la Configuración</h3>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Restaurante:</span>
            <span className="font-medium">{data.restaurant.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Categorías:</span>
            <span className="font-medium">{data.categories.length} creadas</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Productos:</span>
            <span className="font-medium">{data.items.length} agregados</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Filtros:</span>
            <span className="font-medium">{data.filters.length} configurados</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Próximos Pasos</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">📱</span>
            <span>Personalizá tu menú agregando más productos y categorías</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🎨</span>
            <span>Subí imágenes personalizadas para tus productos</span>
          </li>
          {data.restaurant.hasCart && (
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>Revisá las estadísticas de pedidos en el panel de administración</span>
            </li>
          )}
          <li className="flex items-start">
            <span className="mr-2">🔗</span>
            <span>Compartí el enlace de tu menú con tus clientes</span>
          </li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={previousStep} disabled={currentStep === 0} variant="secondary">
          ← Anterior
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Finalizando...' : 'Ir al Panel de Administración'}
        </Button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Podés seguir configurando tu menú en cualquier momento desde el panel de administración
      </p>
    </div>
  )
}
