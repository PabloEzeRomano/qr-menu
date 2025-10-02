'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContextProvider'
import { useMenuData } from './MenuDataProvider'
import { OnboardingStep, OnboardingData, OnboardingContextType } from '@/types/onboarding'
import { getOnboardingStatus, onboardingComplete } from '@/lib/api/restaurant'

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const initialSteps: OnboardingStep[] = [
  {
    id: 'restaurant',
    title: 'Información del Restaurante',
    description: 'Configura los datos básicos de tu restaurante',
    component: 'RestaurantSetup',
    isCompleted: false,
  },
  {
    id: 'categories',
    title: 'Categorías del Menú',
    description: 'Crea las categorías para organizar tu menú',
    component: 'CategoriesSetup',
    isCompleted: false,
  },
  {
    id: 'items',
    title: 'Productos',
    description: 'Agrega algunos productos para empezar',
    component: 'ItemsSetup',
    isOptional: true,
    isCompleted: false,
  },
  {
    id: 'filters',
    title: 'Filtros',
    description: 'Configura filtros para tus clientes',
    component: 'FiltersSetup',
    isOptional: true,
    isCompleted: false,
  },
  {
    id: 'complete',
    title: '¡Listo!',
    description: 'Tu restaurante está configurado',
    component: 'OnboardingComplete',
    isCompleted: false,
  },
]

const initialData: OnboardingData = {
  restaurant: {
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    hasCart: false,
    showAnimatedBackground: true,
    customBackground: '',
  },
  categories: [],
  items: [],
  filters: [],
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { restaurant, categories, items, filters } = useMenuData()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedExistingData, setHasLoadedExistingData] = useState(false)

  const loadExistingData = useCallback(() => {
    const existingData: OnboardingData = {
      restaurant: {
        name: restaurant?.name || '',
        description: restaurant?.description || '',
        address: restaurant?.address || '',
        phone: restaurant?.phone || '',
        email: restaurant?.email || '',
        website: restaurant?.website || '',
        hasCart: !!restaurant?.hasCart,
      },
      categories: categories.map((cat) => ({
        key: cat.key,
        label: cat.label,
        icon: cat.icon,
        isVisible: cat.isVisible,
      })),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        img: item.img,
        isVisible: item.isVisible,
      })),
      filters: filters.map((filter) => ({
        key: filter.key,
        label: filter.label,
        id: filter.id,
        type: filter.type,
        predicate: filter.predicate,
        isActive: filter.isActive,
        order: filter.order,
      })),
    }

    setData(existingData)
    setHasLoadedExistingData(true)

    // Mark steps as completed based on existing data
    setSteps((prev) => {
      const updatedSteps = prev.map((step, index) => {
        let isCompleted = false

        switch (step.id) {
          case 'restaurant':
            isCompleted = !!existingData.restaurant.name
            break
          case 'categories':
            isCompleted = existingData.categories.length > 0
            break
          case 'items':
            isCompleted = existingData.items.length > 0
            break
          case 'filters':
            isCompleted = existingData.filters.length > 0
            break
          case 'complete':
            isCompleted = false // Always false until onboarding is actually completed
            break
        }

        return { ...step, isCompleted }
      })

      // Navigate to the first incomplete step
      const firstIncompleteStep = updatedSteps.findIndex(
        (step) => !step.isCompleted && step.id !== 'complete',
      )
      if (firstIncompleteStep !== -1) {
        setCurrentStep(firstIncompleteStep)
      }

      return updatedSteps
    })
  }, [restaurant, categories, items, filters])

  // Check if user has already completed onboarding and load existing data
  useEffect(() => {
    if (!user || hasLoadedExistingData) return

    const checkOnboardingStatusAndLoadData = async () => {
      try {
        // Check onboarding status
        const response = await getOnboardingStatus()
        setIsCompleted(response.completed)
        // If not completed, load existing data to pre-populate the form
        if (!response.completed) {
          loadExistingData()
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // If error, assume not completed and load existing data
        loadExistingData()
      }
    }

    checkOnboardingStatusAndLoadData()
  }, [user, hasLoadedExistingData, loadExistingData])

  // Load existing data from Firebase to pre-populate onboarding

  const updateData = useCallback((step: string, stepData: any) => {
    setData((prev) => ({
      ...prev,
      [step]: stepData,
    }))
  }, [])

  const markStepCompleted = useCallback((stepIndex: number) => {
    setSteps((prev) =>
      prev.map((step, index) => (index === stepIndex ? { ...step, isCompleted: true } : step)),
    )
  }, [])

  const nextStep = useCallback(() => {
    markStepCompleted(currentStep)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    setError(null)
  }, [currentStep, steps.length, markStepCompleted])

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setError(null)
  }, [])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step)
        setError(null)
      }
    },
    [steps.length],
  )

  const skipStep = useCallback(() => {
    markStepCompleted(currentStep)
    nextStep()
  }, [currentStep, nextStep, markStepCompleted])

  const completeOnboarding = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Mark onboarding as complete
      await onboardingComplete()
      setIsCompleted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const value: OnboardingContextType = {
    currentStep,
    totalSteps: steps.length,
    steps,
    data,
    isCompleted,
    isLoading,
    error,
    nextStep,
    previousStep,
    goToStep,
    updateData,
    completeOnboarding,
    skipStep,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
