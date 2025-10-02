'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/contexts/OnboardingProvider'
import { Input, TextArea, Switch } from '@/components/ui'
import { useImageOperations } from '@/hooks/useImageOperations'
import Button from '@/components/ui/Button'
import Image from 'next/image'

export default function RestaurantSetup() {
  const { data, updateData, nextStep, previousStep, currentStep } = useOnboarding()
  const [formData, setFormData] = useState(data.restaurant)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { uploadImage } = useImageOperations()

  // Sync form data when context data changes (e.g., when existing data is loaded)
  useEffect(() => {
    setFormData(data.restaurant)
  }, [data.restaurant])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del restaurante es obligatorio'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Ingresa una URL válida (ej: https://ejemplo.com)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      updateData('restaurant', formData)
      nextStep()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Información del Restaurante</h2>
        <p className="text-lg text-gray-600">
          Configura los datos básicos de tu restaurante para personalizar tu menú digital
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del Restaurante *"
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: La Parrilla del Chef"
          error={errors.name}
        />

        <TextArea
          label="Descripción"
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          placeholder="Describe tu restaurante, especialidades, ambiente..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Dirección"
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Calle, número, ciudad"
          />

          <Input
            label="Teléfono"
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+54 11 1234-5678"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contacto@restaurante.com"
            error={errors.email}
          />

          <Input
            label="Sitio Web"
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.restaurante.com"
            error={errors.website}
          />

          <Switch
            label="¿Querés que tus clientes puedan hacer pedidos online?"
            checked={!!formData.hasCart}
            onChange={(checked) => handleInputChange('hasCart', checked)}
            color="green"
            // size="md"
          />

          <Switch
            label="¿Mostrar fondo animado en el menú?"
            checked={!!formData.showAnimatedBackground}
            onChange={(checked) => handleInputChange('showAnimatedBackground', checked)}
            color="blue"
          />
        </div>

        {/* Custom Background Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Imagen de fondo personalizada (opcional)
          </label>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  try {
                    const imageUrl = await uploadImage(file)
                    handleInputChange('customBackground', imageUrl)
                  } catch (error) {
                    console.error('Error uploading image:', error)
                  }
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.customBackground && (
              <div className="relative">
                <Image
                  src={formData.customBackground}
                  alt="Custom background preview"
                  width={64}
                  height={64}
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('customBackground', '')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Si subís una imagen, se mostrará como fondo del menú. Las animaciones se mostrarán sobre
            la imagen si están habilitadas.
          </p>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit">Continuar</Button>
        </div>
      </form>
    </div>
  )
}
