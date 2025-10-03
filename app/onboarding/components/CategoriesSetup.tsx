'use client'

import { useEffect,useState } from 'react'

import { Trash2 } from 'lucide-react'

import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useOnboarding } from '@/contexts/OnboardingProvider'
import { useCategoryOperations } from '@/hooks/useCategoryOperations'
import { useErrorHandler } from '@/hooks/useErrorHandler'

const COMMON_EMOJIS = ['🍕', '🍔', '🍝', '🥗', '🍣', '🌮', '🥘', '🍖', '🍰', '☕', '🍺', '🥤']
const COMMON_CATEGORIES = [
  { label: 'Entradas', icon: '🥗', key: 'entradas' },
  { label: 'Platos Principales', icon: '🍖', key: 'principales' },
  { label: 'Pizzas', icon: '🍕', key: 'pizzas' },
  { label: 'Hamburguesas', icon: '🍔', key: 'hamburguesas' },
  { label: 'Pastas', icon: '🍝', key: 'pastas' },
  { label: 'Postres', icon: '🍰', key: 'postres' },
  { label: 'Bebidas', icon: '🥤', key: 'bebidas' },
  { label: 'Café', icon: '☕', key: 'cafe' },
]

export default function CategoriesSetup() {
  const { data, updateData, nextStep, previousStep, skipStep, steps, currentStep } = useOnboarding()
  const [categories, setCategories] = useState(data.categories)
  const [isLoading, setIsLoading] = useState(false)
  const { handleAddCategory } = useCategoryOperations()
  const { handleError } = useErrorHandler()

  // Sync categories when context data changes (e.g., when existing data is loaded)
  useEffect(() => {
    setCategories(data.categories)
  }, [data.categories])

  const currentStepData = steps[currentStep]
  const hasExistingCategories = categories.length > 0

  const handleAddCustomCategory = () => {
    setCategories((prev) => [...prev, { key: '', label: '', icon: '🍽️', isVisible: true }])
  }

  const handleCategoryChange = (index: number, field: string, value: string) => {
    setCategories((prev) => prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat)))
  }

  const handleRemoveCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const handleQuickAdd = (category: (typeof COMMON_CATEGORIES)[0]) => {
    const exists = categories.some((cat) => cat.key === category.key)
    if (!exists) {
      setCategories((prev) => [...prev, { ...category, isVisible: true }])
    }
  }

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const validateCategories = () => {
    if (categories.length === 0) {
      handleError('error', 'Agrega al menos una categoría')
      return false
    }

    for (const category of categories) {
      if (!category.label.trim()) {
        handleError('error', 'Todas las categorías deben tener un nombre')
        return false
      }
      if (!category.key.trim()) {
        handleError('error', 'Todas las categorías deben tener una clave única')
        return false
      }
    }

    const keys = categories.map((cat) => cat.key)
    const uniqueKeys = new Set(keys)
    if (keys.length !== uniqueKeys.size) {
      handleError('error', 'Las claves de las categorías deben ser únicas')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCategories()) return

    setIsLoading(true)
    try {
      // Create categories in Firebase
      for (const category of categories) {
        const key = category.key || generateKey(category.label)
        await handleAddCategory({
          key,
          label: category.label,
          icon: category.icon,
          isVisible: true,
        })
      }

      updateData('categories', categories)
      nextStep()
    } catch (error) {
      handleError('error', 'Error al crear las categorías')
      console.error('Error creating categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorías del Menú</h2>
        <p className="text-lg text-gray-600">
          Organiza tu menú en categorías para que tus clientes encuentren fácilmente lo que buscan
        </p>
        {hasExistingCategories && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <strong>¡Excelente!</strong> Ya tenés {categories.length} categoría
              {categories.length !== 1 ? 's' : ''} configurada{categories.length !== 1 ? 's' : ''}.
              Podés editarlas o agregar más.
            </p>
          </div>
        )}
      </div>

      {/* Quick Add Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías Populares</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMMON_CATEGORIES.map((category) => (
            <button
              key={category.key}
              onClick={() => handleQuickAdd(category)}
              disabled={categories.some((cat) => cat.key === category.key)}
              className="flex items-center space-x-2 p-3 border border-gray-300 text-gray-600 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">Tus Categorías</h3>
            <Button type="button" onClick={handleAddCustomCategory} size="sm">
              + Agregar Categoría
            </Button>
          </div>

          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <Input
                  type="text"
                  value={category.label}
                  onChange={(e) => {
                    handleCategoryChange(index, 'label', e.target.value)
                    handleCategoryChange(index, 'key', generateKey(e.target.value))
                  }}
                  placeholder="Nombre de la categoría"
                  containerClassName="mb-0"
                />
              </div>

              <div className="flex-shrink-0">
                <Input
                  type="text"
                  value={category.icon}
                  onChange={(e) => handleCategoryChange(index, 'icon', e.target.value)}
                  className="text-center"
                  placeholder="🍽️"
                  maxLength={2}
                />
              </div>

              <div className="flex-shrink-0">
                <Input
                  type="text"
                  value={category.key}
                  onChange={(e) => handleCategoryChange(index, 'key', e.target.value)}
                  placeholder="clave-unica"
                  containerClassName="mb-0 w-32"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="flex-shrink-0 text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={previousStep} disabled={currentStep === 0} variant="ghost">
            ← Anterior
          </Button>

          <div className="space-x-3 flex items-center gap-2 flex-row">
            <Button type="button" onClick={skipStep} variant="secondary">
              Omitir
            </Button>
            <Button
              type="submit"
              disabled={isLoading || categories.length === 0}
              loading={isLoading}
            >
              Continuar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
