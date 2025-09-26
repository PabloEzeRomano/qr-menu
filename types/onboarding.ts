import { Category, Filter, MenuItem, Restaurant } from '.'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: string
  isOptional?: boolean
  isCompleted: boolean
}

export interface OnboardingData {
  restaurant: Restaurant
  categories: Category[]
  items: MenuItem[]
  filters: Filter[]
}

export interface OnboardingContextType {
  currentStep: number
  totalSteps: number
  steps: OnboardingStep[]
  data: OnboardingData
  isCompleted: boolean
  isLoading: boolean
  error: string | null
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  updateData: (step: string, data: any) => void
  completeOnboarding: () => Promise<void>
  skipStep: () => void
}
