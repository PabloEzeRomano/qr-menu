'use client'

import { Input, Switch, TextArea } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useImageOperations } from '@/hooks/useImageOperations'
import { useRestaurantOperations } from '@/hooks/useRestaurantOperations'
import { Save, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AdminSettings() {
  const { restaurant, loading } = useMenuData()
  const { handleRestaurantSave } = useRestaurantOperations()
  const { uploadImage } = useImageOperations()
  const { handleError, showToast } = useErrorHandler()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    hasCart: false,
    showAnimatedBackground: true,
    customBackground: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Sync form data when restaurant data loads
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        website: restaurant.website || '',
        hasCart: restaurant.hasCart || false,
        showAnimatedBackground: restaurant.showAnimatedBackground !== false,
        customBackground: restaurant.customBackground || '',
      })
    }
  }, [restaurant])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      handleInputChange('customBackground', imageUrl)
    } catch (error) {
      handleError('Error al subir la imagen', 'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await handleRestaurantSave(formData)
      showToast('Configuración guardada exitosamente', 'info')
    } catch (error) {
      handleError('Error al guardar la configuración', 'save')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Restaurante</h1>
        <p className="text-gray-600 mt-2">
          Personaliza la apariencia y configuración de tu menú digital
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Restaurant Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Restaurante</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre del Restaurante"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nombre de tu restaurante"
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+54 11 1234-5678"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contacto@restaurante.com"
            />

            <Input
              label="Sitio Web"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.restaurante.com"
            />
          </div>

          <div className="mt-6">
            <TextArea
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              placeholder="Describe tu restaurante..."
            />
          </div>

          <div className="mt-6">
            <Input
              label="Dirección"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Dirección completa del restaurante"
            />
          </div>
        </div>

        {/* Menu Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración del Menú</h2>

          <div className="space-y-6">
            <Switch
              label="¿Permitir pedidos online?"
              checked={formData.hasCart}
              onChange={(checked) => handleInputChange('hasCart', checked)}
              color="green"
            />

            <Switch
              label="¿Mostrar fondo animado?"
              checked={formData.showAnimatedBackground}
              onChange={(checked) => handleInputChange('showAnimatedBackground', checked)}
              color="blue"
            />
          </div>
        </div>

        {/* Background Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fondo Personalizado</h2>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Imagen de fondo personalizada
            </label>

            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file)
                      }
                    }}
                    disabled={isUploading}
                    className="hidden"
                    id="background-upload"
                  />
                  <label
                    htmlFor="background-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {isUploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">JPG, PNG o WebP. Máximo 5MB.</span>
                  </label>
                </div>
              </div>

              {formData.customBackground && (
                <div className="relative">
                  <div className="w-32 h-20 border rounded-lg overflow-hidden">
                    <Image
                      src={formData.customBackground}
                      alt="Custom background preview"
                      width={128}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('customBackground', '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Si subís una imagen, se mostrará como fondo del menú. Las animaciones se mostrarán
              sobre la imagen si están habilitadas.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Configuración</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
