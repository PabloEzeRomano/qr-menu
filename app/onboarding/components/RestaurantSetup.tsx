'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/contexts/OnboardingProvider'
import { Input, TextArea, Switch } from '@/components/ui'
import Button from '@/components/ui/Button'

export default function RestaurantSetup() {
  const { data, updateData, nextStep, previousStep, currentStep } = useOnboarding()
  const [formData, setFormData] = useState(data.restaurant)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit">Continuar</Button>
        </div>
      </form>
    </div>
  )
}
